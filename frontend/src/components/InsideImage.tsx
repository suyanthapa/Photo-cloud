import React from "react";
import Navbar from "./Navbar";

const InsideImage: React.FC = () => {
  return (
    <div
      className="relative flex min-h-screen flex-col bg-white overflow-x-hidden"
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      <div className="flex h-full grow flex-col">
      <Navbar />
        <div className="flex flex-1 justify-center gap-1 px-6 py-5">
          <div className="flex max-w-[920px] flex-1 flex-col">
            <div className="flex w-full grow bg-white py-3">
              <div className="flex w-full overflow-hidden aspect-[3/2]">
                <div
                  className="flex-1 bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage:
                      'url("https://cdn.usegalileo.ai/sdxl10/34a2af7a-c841-4d92-aca7-5735b284ad4b.png")',
                  }}
                  
                ></div>
              </div>
            </div>
          </div>
          <div className="flex w-[360px] flex-col">
            <div className="grid grid-cols-[20%_1fr] gap-x-6 p-4">
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#E9DFCE] py-5">
                <p className="text-[#A18249] text-sm">Description</p>
                <p className="text-[#1C160C] text-sm">
                  Upper Mustang with beautiful scene
                </p>
              </div>
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#E9DFCE] py-5">
                <p className="text-[#A18249] text-sm">Uploaded Date</p>
                <p className="text-[#1C160C] text-sm">June 16, 2025</p>
              </div>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(80px,_1fr))] gap-2 px-4">
              {[
                {
                  label: 'Share on Facebook',
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M128,24A104,104,0,1,0...Z" />
                    </svg>
                  ),
                },
                {
                  label: 'Share on Twitter',
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M247.39,68.94A8,8,0,0...Z" />
                    </svg>
                  ),
                },
                {
                  label: 'Share on Instagram',
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M128,80a48,48,0,1,0...Z" />
                    </svg>
                  ),
                },
                {
                  label: 'Copy Link',
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M137.54,186.36a8,8,0,0...Z" />
                    </svg>
                  ),
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-2 bg-white py-2.5 text-center"
                >
                  <div className="rounded-full bg-[#F4EFE6] p-2.5 text-[#1C160C]">
                    {item.icon}
                  </div>
                  <p className="text-[#1C160C] text-sm font-medium">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsideImage;
