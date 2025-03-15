"use client";

import { showAlert } from "@/app/components/Toast/Toast";
import { AlertContext } from "@/app/core/client/store/alert/AlertContext";
import { InternalizationContext } from "@/app/core/client/store/internalization/InternalizationContext";
import { error } from "console";
import { useContext, useEffect } from "react";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error(props: Props) {

  useEffect(() => {
    console.log(props.error);
  }, [props.error]);

  return (
    <div className="mt-12 mx-auto">
      <div className="relative bg-white rounded-2xl shadow-lg dark:bg-gray-700 max-w-sm mx-auto overflow-hidden">
          {/* Modal header */}
          <div className="flex bg-red-500 p-4">
            <div className="my-auto mx-auto flex text-center rounded-full w-8 h-8 border-white border-2 text-white items-center justify-center">
              !
            </div>
          </div>
          {/* Modal body */}
          <div className="flex flex-col p-4">
            <div className=""></div>
            <div className="text-center font-semibold text-lg">
              {"Error"}
            </div>
            <div className="text-center text-base">
              {props.error.name ?? "Something go wrong"}
            </div>
          </div>
          {/* footer */}
          <div className="flex flex-row justify-center p-4">
            <button
              type="button"
              className="p-2 rounded-full mx-4 w-1/3 text-white bg-red-500 text-base hover:bg-red-600 shadow-lg"
              onClick={()=>props.reset()}
            >
              Try Again
            </button>
          </div>
      </div>
    </div>
  );
}
