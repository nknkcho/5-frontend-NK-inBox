const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const postRequest = async (path: string, body: object) => {
  const res = await fetch(`${baseUrl}/${path}`, {
    body: JSON.stringify(body),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })

  return res
}

export const getRequest = async (path: string) => {
  const res = await fetch(`${baseUrl}/${path}`, {
    method: "GET",
    credentials: "include",
  })

  // const data = await res.json();
  return res
}