"use server";

import { getStoryService } from "@/app/core/server/context";
import { StoryFilter } from "./story";
import { InputValidate, useSchemaItem } from "@/app/utils/validate/validate";
import { ValidateErrors } from "@/app/utils/validate/model";
import { IP, userAgent } from "@/actions";
import { redirect } from "next/navigation";
import { ResponseError } from "@/app/utils/exception/model/response-error";
import { Error422Message } from "@/app/utils/exception/model/response";

export const search = async (filter: StoryFilter) => {
  return getStoryService().all(filter);
};

export interface StoryActionState {
  fieldErrors: ValidateErrors;
}

export const create = async (
  text: string,
  prevState: StoryActionState,
  formData: FormData,
): Promise<StoryActionState> => {
  const ua = await userAgent();
  const ip = await IP();
  const errs = InputValidate.object({
    text: useSchemaItem("text").hasMaxLength(6000).isRequired(),
  }).validate({ text: text });
  if (JSON.stringify(errs) !== "{}") {
    return { ...prevState, fieldErrors: errs };
  }
  try {
    // hard code
    return { ...prevState, fieldErrors: {} };
  } catch (err: any) {
    const e = err as ResponseError<Error422Message[]>;

    if (e.status == 422) {
      const fieldErrs: ValidateErrors = {};
      e.body.forEach((item) => {
        fieldErrs[item.field] = item.message;
      });

      return { ...prevState, fieldErrors: fieldErrs };
    } else {
      throw e;
    }
  }
};
