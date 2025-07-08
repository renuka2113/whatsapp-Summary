import React, { useState } from 'react';
import { 
  X, 
  User, 
  Edit, 
  Save, 
  Camera, 
  Building, 
  MapPin, 
  Shield, 
  Badge, 
  Phone, 
  Mail, 
  Calendar, 
  Users,
  Clock
} from 'lucide-react';

const ProfileModal = ({ isOpen, onClose, user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  if (!isOpen) return null;

  const handleSave = () => {
    // Add save logic here
    console.log('Saving user data:', editedUser);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditedUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative p-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-t-3xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                src={user.avatar}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-white/30 shadow-lg object-cover"
              />
              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-50 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2">{user.name}</h2>
              <p className="text-blue-100 text-lg font-medium">{user.rank}</p>
              <p className="text-white/80 text-sm">ID: {user.id} • Badge: {user.badgeNumber}</p>
            </div>
            
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl flex items-center space-x-2 transition-colors font-medium"
            >
              {isEditing ? <Save className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
              <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-3">
                Personal Information
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl">
                  <User className="h-5 w-5 text-slate-500" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-slate-600">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-slate-800 font-medium">{user.name}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-slate-50 to-emerald-50 rounded-xl">
                  <Phone className="h-5 w-5 text-slate-500" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-slate-600">Mobile Number</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedUser.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-slate-800 font-medium">{user.phone}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-slate-50 to-purple-50 rounded-xl">
                  <Mail className="h-5 w-5 text-slate-500" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-slate-600">Email Address</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedUser.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-slate-800 font-medium">{user.email}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-slate-50 to-amber-50 rounded-xl">
                  <Calendar className="h-5 w-5 text-slate-500" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-slate-600">Date of Joining</label>
                    <p className="text-slate-800 font-medium">{user.dateOfJoining}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-slate-50 to-green-50 rounded-xl">
                  <Clock className="h-5 w-5 text-slate-500" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-slate-600">Service Years</label>
                    <p className="text-slate-800 font-medium">{user.serviceYears}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Official Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-3">
                Official Information
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                  <Building className="h-5 w-5 text-slate-500" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-slate-600">Police Station</label>
                    <p className="text-slate-800 font-medium">{user.station}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl">
                  <MapPin className="h-5 w-5 text-slate-500" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-slate-600">Sub-Division</label>
                    <p className="text-slate-800 font-medium">{user.subDivision}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                  <Shield className="h-5 w-5 text-slate-500" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-slate-600">Circle</label>
                    <p className="text-slate-800 font-medium">{user.circle}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl">
                  <Badge className="h-5 w-5 text-slate-500" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-slate-600">Unit</label>
                    <p className="text-slate-800 font-medium">{user.unit}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl">
                  <MapPin className="h-5 w-5 text-slate-500" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-slate-600">District</label>
                    <p className="text-slate-800 font-medium">{user.district}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Attached Constables */}
          <div className="mt-8 space-y-6">
            <h3 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-3 flex items-center">
              <Users className="h-6 w-6 mr-2" />
              Attached Constables
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {user.attachedConstables.map((constable, index) => (
                <div key={index} className="bg-gradient-to-r from-white to-slate-50 p-5 rounded-xl border border-slate-200 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800 text-sm">{constable.name}</h4>
                      <p className="text-slate-500 text-xs flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {constable.mobile}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="mt-8 flex justify-end space-x-4 pt-6 border-t border-slate-200">
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 text-slate-600 hover:text-slate-800 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
