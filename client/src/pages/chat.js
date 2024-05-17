import { useState } from "react";
import CreateChat from "../components/CreateChat";

function Chat() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  };

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <div className="w-1/4 flex flex-col justify-between bg-white border-r border-gray-300">
          <div>
            <header
              onClick={handleOpen}
              className="p-4 border-b border-gray-300 flex justify-between items-center bg-indigo-600 text-white cursor-pointer"
            >
              <h1 className="text-2xl font-semibold">New Chat Create</h1>
            </header>
            <div className="overflow-y-auto h-auto p-3 mb-9 pb-20">
              <div className="flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-3">
                  <img
                    src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
                    alt="User Avatar"
                    className="w-12 h-12 rounded-full"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">Alice</h2>
                  <p className="text-gray-600">Hoorayy!!</p>
                </div>
              </div>
            </div>
          </div>
          <div
            className="my-5 flex items-center justify-center bg-indigo-500 text-white rounded-lg p-3 gap-3 cursor-pointer"
            onClick={handleLogout}
          >
            <p>Logout</p>
          </div>
        </div>

        <div className="flex-1">
          <header className="bg-white p-4 text-gray-700">
            <h1 className="text-2xl font-semibold">Alice</h1>
          </header>

          <div className="h-screen overflow-y-auto p-4 pb-36">
            <div className="flex mb-4 cursor-pointer">
              <div className="w-9 h-9 rounded-full flex items-center justify-center mr-2">
                <img
                  src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full"
                />
              </div>
              <div className="flex max-w-96 bg-white rounded-lg p-3 gap-3">
                <p className="text-gray-700">Hey Bob, how's it going?</p>
              </div>
            </div>

            <div className="flex justify-end mb-4 cursor-pointer">
              <div className="flex max-w-96 bg-indigo-500 text-white rounded-lg p-3 gap-3">
                <p>
                  Hi Alice! I'm good, just finished a great book. How about you?
                </p>
              </div>
              <div className="w-9 h-9 rounded-full flex items-center justify-center ml-2">
                <img
                  src="https://placehold.co/200x/b7a8ff/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
                  alt="My Avatar"
                  className="w-8 h-8 rounded-full"
                />
              </div>
            </div>
          </div>

          <footer className="bg-white border-t border-gray-300 p-4 absolute bottom-0 w-3/4">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Type a message..."
                className="w-full p-2 rounded-md border border-gray-400 focus:outline-none focus:border-blue-500"
              />
              <button className="bg-indigo-500 text-white px-4 py-2 rounded-md ml-2">
                Send
              </button>
            </div>
          </footer>
        </div>
      </div>
      {open && <CreateChat handleClose={handleClose} />}
    </>
  );
}

export default Chat;
