import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/registration",
    name: "Registration",
    component: () => import("../views/LoginView.vue"),
  },
  {
    path: "/machines",
    name: "Machines",
    component: () => import("../views/Machines.vue"),
  },
  {
    path: "/hmicertificate/pdf",
    name: "HmiCertificate",
    component: () => import("../views/HmiCertificate.vue"),
  },
  {
    path: "/confirmemail",
    name: "Confirm",
    component: () => import("../views/Confirmemail.vue"),
  },
  {
    path: "/wentwrong",
    name: "Wrong",
    component: () => import("../views/Wrong.vue"),
  },
  {
    path: "/home",
    name: "Home",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/map",
    name: "Map",
    component: () => import("../views/Map.vue"),
  },
  {
    path: "/report",
    name: "report",
    component: () => import("../views/Report"),
  },

  {
    path: "/forgotpassword",
    name: "forgot",
    component: () => import("../views/ForgotPassword.vue"),
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("../views/Profile.vue"),
  },
  {
    path: "/addlicense",
    name: "add License",
    component: () => import("../views/AddLicense.vue"),
  },
  {
    path: "/bookedappointment",
    name: "Booked Appointment",
    component: () => import("../views/BookedAppointment.vue"),
  },
  {
    path: "/license",
    name: "License",
    component: () => import("../views/License.vue"),
  },
  {
    path: "/appointment",
    name: "Appointment",
    component: () => import("../views/Appointment.vue"),
  },
  {
    path: "/contact",
    name: "Contact",
    component: () => import("../views/Contact.vue"),
  },
  {
    path: "/profile/editprofile",
    name: "EditProfile",
    component: () => import("../views/EditProfile.vue"),
  },
  {
    path: "/certificates",
    name: "Certificate",
    component: () => import("../views/Certificate.vue"),
  },
  {
    path: "/certificatelist",
    name: "CertificateList",
    component: () => import("../views/CertificateList.vue"),
  },
  {
    path: "/resetpassword",
    name: "Resetemail",
    component: () => import("../views/ResetPassEmail.vue"),
  },
  {
    path: "/setnewpassword/:token",
    name: "Setnewpassword",
    component: () => import("../views/Setpassword.vue"),
  },
  {
    path: "/certificate/pdf",
    name: "CertificatePDF",
    component: () => import("../views/CertificatePdf.vue"),
  },
  {
    path: "/updatepassword",
    name: "UpdatePassword",
    component: () => import("../views/UpdatePassword.vue"),
  },
  {
    path: "/verify/:token",
    name: "verifyToken",
    component: () => import("../views/Verify.vue"),
  },
  {
    path: "/tremsandconditions",
    name: "termsandcondition",
    component: () => import("../views/TermCondition.vue"),
  },
  {
    path: "/test",
    name: "Test",
    component: () => import("../views/Test.vue"),
  },
  {
    path: "/validate",
    name: "Validate",
    component: () => import("../views/Validation.vue"),
  },
  {
    path: "/messages",
    name: "Messages",
    component: () => import("../views/Messages.vue"),
  },
  {
    path: "/certificatecontact",
    name: "CertificateContact",
    component: () => import("../views/certificateContact.vue"),
  },
  {
    path: "/ownercustomerregistration",
    name: "OwnerCustomerRegistration",
    component: () => import("../views/predefiendCustomer.vue"),
  },
  {
    path:"/ownercustomersuccess",
    name:"OwnerCustomerSuccess",
    component: () => import("../views/PredefiendConfirmed.vue"),
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: () => import('../components/NotFound.vue')
  },

 
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
