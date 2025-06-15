
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e7eef4] px-10 py-3">
      <div className="flex items-center gap-4 text-[#0d151c]">
        <div className="size-4">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <h2 className="text-[#0d151c] text-lg font-bold leading-tight tracking-[-0.015em]">Photo Cloud</h2>
      </div>
      <div className="flex flex-1 justify-end gap-8">
        <div className="flex items-center gap-9">
          <Link className="text-[#0d151c] text-sm font-medium leading-normal" to="/dashboard">Home</Link>
          <Link className="text-[#0d151c] text-sm font-medium leading-normal" to="/upload">Upload</Link>
           <Link className="text-[#0d151c] text-sm font-medium leading-normal" to="/allPhotos">All Photos</Link>
          <a className="text-[#0d151c] text-sm font-medium leading-normal" href="#">Create</a>
        </div>
        <div className="flex gap-2">
          <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 bg-[#e7eef4] text-[#0d151c] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
            </svg>
          </button>
          <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 bg-[#e7eef4] text-[#0d151c] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M200,40H56A16,16,0,0,0,40,56V200a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,80H136V56h64ZM120,56v64H56V56ZM56,136h64v64H56Zm144,64H136V136h64v64Z" />
            </svg>
          </button>
        </div>
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
          style={{ backgroundImage: 'url("https://cdn.usegalileo.ai/sdxl10/8eb4c70f-5045-413c-b38d-0dfa03eebade.png")' }}
        ></div>
      </div>
    </header>
  );
}
