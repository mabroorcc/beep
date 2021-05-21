export const jsonReq = async (url: string, method?: string, body?: any) => {
  if (method === "get") return fetch(url);
  return fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
};
