
const SkeletonBubbleChat = ({idx}) => {
  return (
    <div className={`animate-pulse flex ${idx %2 === 0 ? "justify-start" : "justify-end"} gap-2.5 relative mb-6`}>
      {idx %2 === 0 ? (
        <svg
        className="w-8 h-8 me-3 text-gray-200 dark:text-gray-700"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
      </svg>
      ) : (
        <button
        id="dropdownMenuIconButton"
        data-dropdown-toggle="dropdownDots"
        data-dropdown-placement="bottom-start"
        className="inline-flex self-center items-center p-2 text-sm font-medium text-center   rounded-lg   "
        type="button"
      >
        <svg
          className="w-4 h-4 text-gray-400"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 4 15"
        >
          <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
        </svg>
      </button>
      )}
      <div className="flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200  rounded-e-xl rounded-es-xl bg-gray-700">
        <div className="flex items-center space-x-2 rtl:space-x-reverse my-2.5">
          <span className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 ">
    
          </span>
          <span className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-10 ">
  
          </span>
        </div>
        <p className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-46 my-2.5">
          
        </p>
        <p className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-40 mb-2.5">
          
        </p>
        <span className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-14 my-2.5">
    
        </span>
      </div>
      
  
      {idx %2 !== 0 ? (
        <svg
        className="w-8 h-8 me-3 text-gray-200 dark:text-gray-700"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
      </svg>
      ) : (
        <button
        id="dropdownMenuIconButton"
        data-dropdown-toggle="dropdownDots"
        data-dropdown-placement="bottom-start"
        className="inline-flex self-center items-center p-2 text-sm font-medium text-center   rounded-lg   "
        type="button"
      >
        <svg
          className="w-4 h-4 text-gray-400"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 4 15"
        >
          <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
        </svg>
      </button>
      )}
    

    </div>
  );
};
export default SkeletonBubbleChat;
