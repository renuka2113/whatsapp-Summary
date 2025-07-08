import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import Task from "./models/tasks.js";
import Member from "./models/Member.js";
// import Reporting from './models/Reporting.js'; // your reporting hierarchy model

dotenv.config();

try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB");

  // Load tasks JSON
  const taskData = JSON.parse(fs.readFileSync("./tasks.json", "utf-8"));
  const membersList = JSON.parse(
    fs.readFileSync("./members_info.json", "utf-8")
  );
  const reportingList = JSON.parse(
    fs.readFileSync("./hierarchy.json", "utf-8")
  );

  // Fetch member and hierarchy data from DB
  // const membersList = await Member.find().lean();
  // const reportingList = await Reporting.find().lean();

  // === Build name-to-member map ===
  const nameToMember = {};
  membersList.forEach((member) => {
    nameToMember[member.Officer_Name] = member;
  });

  // === Build hierarchy tree ===
  const hierarchyTree = {};
  reportingList.forEach((entry) => {
    const manager = entry.Reports_to;
    const member = entry.mem_id;

    if (manager && manager !== member) {
      if (!hierarchyTree[manager]) hierarchyTree[manager] = [];
      hierarchyTree[manager].push(member);
    }
  });

  // === Get subordinates recursively ===
  function getAllSubordinates(memId, tree) {
    const result = [];
    const stack = [memId];
    while (stack.length) {
      const current = stack.pop();
      const subs = tree[current] || [];
      result.push(...subs);
      stack.push(...subs);
    }
    return result;
  }

  // === Resolve member by name or phone ===
  const findMember = async (personStr) => {
    if (!personStr || personStr.toLowerCase().includes("not")) return null;

    const members = await Member.find().lean();

    for (const member of members) {
      const fullNameRole = `${member.Officer_Name} (${member.Rank})`
        .toLowerCase()
        .trim();

      if (personStr.toLowerCase().includes(fullNameRole)) {
        return member;
      }
    }

    return null; // no match found
  };

  // === Insert Assigned Tasks ===
  console.log("\n📌 Inserting Assigned Tasks...");
  for (const t of taskData.assigned_tasks) {
    const assigner = await findMember(t.assigned_by);
    if (!assigner) {
      console.warn(`⚠️ Could not find assigner: ${t.assigned_by}`);
      continue;
    }
    const assignees = Array.isArray(t.assigned_to)
      ? t.assigned_to
      : [t.assigned_to];
    for (const assigneeRaw of assignees) {
      const assignee = await findMember(assigneeRaw);
      const assignerId = assigner?.mem_id;

      // If assignee is found, validate and assign
      if (assignee) {
        const assigneeId = assignee.mem_id;
        const isValid = getAllSubordinates(assignerId, hierarchyTree).includes(
          assigneeId
        );

        if (!isValid) {
          console.warn(
            `🚫 Invalid: ${assigner.Officer_Name} cannot assign to ${assignee.Officer_Name}`
          );
          continue;
        }
        console.log(t.task)
        const newTask = new Task({
          assigned_by: assignerId,
          assigned_to: assigneeId,
          message_date: new Date(
            t.time.replace(/(\d{2})\/(\d{2})\/(\d{2})/, "20$3-$2-$1")
          ),
          status: "pending",
          message_id: Math.floor(Math.random() * 100000),
          description: t.task,
        });

        await newTask.save();
        console.log(`✅ Task Inserted: ${t.task} → ${assignee.Officer_Name}`);
      }

      // ❗ If no assignee found, fallback to assigner's direct subordinates
      else {
        const fallbackSubordinates = hierarchyTree[assignerId] || [];

        if (fallbackSubordinates.length === 0) {
          console.warn(
            `⚠️ No assignee matched and no subordinates found for assigner: ${t.assigned_by}`
          );
          continue;
        }

        for (const subId of fallbackSubordinates) {
          const newTask = new Task({
            assigned_by: assignerId,
            assigned_to: subId,
            message_date: new Date(
              t.time.replace(/(\d{2})\/(\d{2})\/(\d{2})/, "20$3-$2-$1")
            ),
            status: "pending",
            message_id: Math.floor(Math.random() * 100000),
            description: t.task + " [Fallback Assigned]",
          });

          await newTask.save();
          console.log(
            `✅ Fallback Assigned: ${t.task} → subordinate ID: ${subId}`
          );
        }
      }
    }
  }
  // === Mark Completed Tasks ===
  console.log("\n📌 Updating Completed Tasks...");
  for (const ct of taskData.completed_tasks) {
    const member = await findMember(ct.completed_by);
    const memberId = member?.mem_id || ct.completed_by;

    const taskDoc = await Task.findOneAndUpdate(
      { assigned_to: memberId, status: { $ne: "completed" } },
      {
        status: "completed",
        completion_message_id: Math.floor(Math.random() * 100000),
      },
      { new: true }
    );

    if (taskDoc) {
      console.log(`✅ Marked Complete: ${taskDoc.description}`);
    } else {
      console.warn(`⚠️ Could not match completed task: ${ct.task}`);
    }
  }
} catch (err) {
  console.error("❗ Error occurred:", err);
} finally {
  await mongoose.disconnect();
  console.log("\n🔌 Disconnected from MongoDB");
}
