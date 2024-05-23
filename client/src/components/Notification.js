import React from "react";

const Notification = ({
  notifications,
  clearUnreadCounts,
  handleNotifyClose,
}) => {
  return (
    <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50 py-10">
      <div className="max-h-full w-full max-w-xl overflow-y-auto sm:rounded-2xl bg-white">
        <div className="w-full">
          <div className="m-8 my-20 max-w-[400px] mx-auto">
            <div className="mb-8">
              <h1 className="mb-4 text-3xl font-extrabold">Notifications</h1>
              <p className="text-gray-600">
                Stay up to date with the latest messages.
              </p>
            </div>
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <p>No new notifications.</p>
              ) : (
                notifications.map((item, index) => (
                  <div key={index} className="flex gap-3 border p-2 rounded-lg">
                    <p className="font-bold">{item.senderUsername}:</p>
                    <p>{item.messageContent}</p>
                  </div>
                ))
              )}
              <button
                onClick={clearUnreadCounts}
                className="p-3 bg-blue-600 rounded-full text-white w-full font-semibold"
              >
                Clear notifications
              </button>
              <button
                onClick={handleNotifyClose}
                className="p-3 bg-gray-300 border rounded-full w-full font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
