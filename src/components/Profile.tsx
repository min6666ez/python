import { useState } from 'react';
import { auth } from '../lib/firebase';

const Profile = () => {
  const [user] = useState(auth.currentUser);

  const handleLogout = async () => {
    await auth.signOut();
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">请先登录</p>
          <a
            href="/login"
            className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            去登录
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">个人信息</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              管理您的账户信息
            </p>
          </div>
          <div className="border-t border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">邮箱</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">用户ID</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user.uid}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">创建时间</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleString() : '未知'}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">最后登录时间</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleString() : '未知'}
                  </dd>
                </div>
              </dl>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={handleLogout}
              >
                退出登录
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;