export const verificationToken = (param) => {
  let { ...restData } = param;
  return Request({
    url: "/accesstoken",
    method: "POST",
    params: restData,
  });
};
