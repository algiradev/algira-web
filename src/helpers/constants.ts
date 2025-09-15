const constans = {
  passwordRegex:
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&.+/])[A-Za-z\d@$!%*#?&.+/]{8,}$/,
  user: {
    get: "/user/",
    singUp: "/auth/signup",
    singIn: "/auth/signin",
    confirmEmail: "/auth/confirm-email/",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password/",
    suggestion: "/user/suggestion",
    update: "/user/update/",
    getProfileDetail: "/user/profile/getProfileDetail",
  },
  raffle: {
    getAll: "/raffle/list-landing",
    get: "/raffle/",
    getByUser: "/user/profile/raffles?filter=%filter%",
  },
  country: {
    get: "/country",
  },
  restCountries: {
    get: "/all",
  },
  ticket: {
    get: "/ticket/raffle/",
  },
  braintree: {
    getToken: "/payment/client_token",
  },
  payment: {
    checkout: "/payment/checkout",
  },
  post: {
    getByTitle: "/post/findOneByTitle",
    sliderTitle: "Slider",
  },
  pixel: {
    upload: "/upload/file",
    // FIXME: Esto va en Variable de entorno
    urlBase:
      "https://res.cloudinary.com/baltasar-montero-vidaurreta-175/image/upload/v1674310561/",
    extraLarge: "extraLarge/",
    extraSmall: "extraSmall/",
    large: "large/",
    normal: "normal/",
    small: "small/",
    thumbnails: "thumbnails/",
    algira: "algira/",
    extension: "webp",
  },
  httpCodes: {
    ok: 200,
    badRequest: 400,
    unauthorized: 401,
    notFound: 404,
    paymentRequired: 402,
    internalServerError: 500,
    badGateway: 502,
  },
};

export default constans;
