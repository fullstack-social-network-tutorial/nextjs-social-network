import { HttpService } from "../../utils/http/http-default";
import { getDeviceId } from "@/app/feature/auth/actions";
import { storeCookies } from "@/app/feature/actions";
import { cookies } from "next/headers";
import { IP, userAgent } from "@/app/dal";
import appContext from "./context";

export const httpServiceInstance = new HttpService({ timeout: 30000 });

httpServiceInstance.interceptors.response.use(async (response, url, options) => {
  if (response.status == 401) {
    handleStatus401(url, options);
  }
  return response;
});

async function handleStatus401(url: string, options: RequestInit) {
  const deviceId = getDeviceId();
  const id = cookies().get("deviceId")?.value;
  const ip = await IP();
  const ua = await userAgent();

  if (deviceId.length == 0 || ua.length == 0 || !id) {
    Promise.reject(
      new Response(undefined, { status: 400, statusText: "Bad Request" })
    );
  } else {
    return appContext.getAuthService()
      .refresh(deviceId, ip, ua)
      .then((res) => {
        if (res) {
          storeCookies({ accessToken: res });
          return httpServiceInstance.get(url, options);
        } else {
          Promise.reject(
            new Response(undefined, {
              status: 400,
              statusText: "Bad Request",
            })
          );
        }
      })
      .catch((e) => {
        throw e;
      })
      .finally(() => (httpServiceInstance.isRefreshing = false));
  }
}
