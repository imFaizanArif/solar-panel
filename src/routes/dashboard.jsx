import { lazy } from "react";
import { Outlet } from "react-router-dom"; // CUSTOM COMPONENTS

import Loadable from "./Loadable";
import { AuthGuard } from "@/components/auth";
import DashboardLayout from "@/layouts/dashboard/DashboardLayout"; // ALL DASHBOARD PAGES

const CRM = Loadable(lazy(() => import("@/pages/dashboard/crm")));
const Finance = Loadable(lazy(() => import("@/pages/dashboard/finance")));
const Analytics = Loadable(lazy(() => import("@/pages/dashboard/analytics")));
const FinanceV2 = Loadable(lazy(() => import("@/pages/dashboard/finance-2")));
const Ecommerce = Loadable(lazy(() => import("@/pages/dashboard/ecommerce")));
const Logistics = Loadable(lazy(() => import("@/pages/dashboard/logistics")));
const Marketing = Loadable(lazy(() => import("@/pages/dashboard/marketing")));
const AnalyticsV2 = Loadable(lazy(() => import("@/pages/dashboard/analytics-2"))); // USER LIST PAGES

const AddNewUser = Loadable(lazy(() => import("@/pages/dashboard/users/add-new-user")));
const UserListView = Loadable(lazy(() => import("@/pages/dashboard/users/user-list-1")));
const UserGridView = Loadable(lazy(() => import("@/pages/dashboard/users/user-grid-1")));
const UserListView2 = Loadable(lazy(() => import("@/pages/dashboard/users/user-list-2")));
const UserGridView2 = Loadable(lazy(() => import("@/pages/dashboard/users/user-grid-2"))); // USER ACCOUNT PAGE

const Account = Loadable(lazy(() => import("@/pages/dashboard/accounts"))); // ALL INVOICE RELATED PAGES

const SolarPanelList = Loadable(lazy(() => import("@/pages/dashboard/solar-panel/list")));
const SolarPanelCreate = Loadable(lazy(() => import("@/pages/dashboard/solar-panel/create")));
const SolarPanelUpdate = Loadable(lazy(() => import("@/pages/dashboard/solar-panel/update")));

const InverterList = Loadable(lazy(() => import("@/pages/dashboard/inverter/list")));
const InverterCreate = Loadable(lazy(() => import("@/pages/dashboard/inverter/create")));
const InverterUpdate = Loadable(lazy(() => import("@/pages/dashboard/inverter/update")));

const StructureList = Loadable(lazy(() => import("@/pages/dashboard/structure/list")));
const StructureCreate = Loadable(lazy(() => import("@/pages/dashboard/structure/create")));
const StructureUpdate = Loadable(lazy(() => import("@/pages/dashboard/structure/update")));

const CablingList = Loadable(lazy(() => import("@/pages/dashboard/cabling/list")));
const CablingCreate = Loadable(lazy(() => import("@/pages/dashboard/cabling/create")));
const CablingUpdate = Loadable(lazy(() => import("@/pages/dashboard/cabling/update")));

const NetMeteringList = Loadable(lazy(() => import("@/pages/dashboard/net-metering/list")));
const NetMeteringCreate = Loadable(lazy(() => import("@/pages/dashboard/net-metering/create")));
const NetMeteringUpdate = Loadable(lazy(() => import("@/pages/dashboard/net-metering/update")));

const InstallationList = Loadable(lazy(() => import("@/pages/dashboard/installation/list")));
const InstallationCreate = Loadable(lazy(() => import("@/pages/dashboard/installation/create")));
const InstallationUpdate = Loadable(lazy(() => import("@/pages/dashboard/installation/update")));
// const InvoiceCreate = Loadable(lazy(() => import("@/pages/dashboard/invoice/create")));
// const InvoiceDetails = Loadable(lazy(() => import("@/pages/dashboard/invoice/details"))); // PRODUCT RELATED PAGES

const BatteriesList = Loadable(lazy(() => import("@/pages/dashboard/batteries/list")));
const BatteriesCreate = Loadable(lazy(() => import("@/pages/dashboard/batteries/create")));
const BatteriesUpdate = Loadable(lazy(() => import("@/pages/dashboard/batteries/update"))); // PRODUCT RELATED PAGES

const LightningArrestorList = Loadable(lazy(() => import("@/pages/dashboard/lightning-arrestor/list")));
const LightningArrestorCreate = Loadable(lazy(() => import("@/pages/dashboard/lightning-arrestor/create")));
const LightningArrestorUpdate = Loadable(lazy(() => import("@/pages/dashboard/lightning-arrestor/update"))); // PRODUCT RELATED PAGES

const ExpenditureList = Loadable(lazy(() => import("@/pages/dashboard/expenditure/list")));
const ExpenditureCreate = Loadable(lazy(() => import("@/pages/dashboard/expenditure/create")));
const ExpenditureUpdate = Loadable(lazy(() => import("@/pages/dashboard/expenditure/update"))); // PRODUCT RELATED PAGES

const InvoiceList = Loadable(lazy(() => import("@/pages/dashboard/invoice/list")));
const InvoiceCreate = Loadable(lazy(() => import("@/pages/dashboard/invoice/create")));
const InvoiceUpdate = Loadable(lazy(() => import("@/pages/dashboard/invoice/update"))); // PRODUCT RELATED PAGES

const ProductList = Loadable(lazy(() => import("@/pages/dashboard/products/list")));
const ProductGrid = Loadable(lazy(() => import("@/pages/dashboard/products/grid")));
const ProductCreate = Loadable(lazy(() => import("@/pages/dashboard/products/create")));
const ProductDetails = Loadable(lazy(() => import("@/pages/dashboard/products/details"))); // E-COMMERCE RELATED PAGES

const Cart = Loadable(lazy(() => import("@/pages/dashboard/ecommerce/cart")));
const Payment = Loadable(lazy(() => import("@/pages/dashboard/ecommerce/payment")));
const BillingAddress = Loadable(lazy(() => import("@/pages/dashboard/ecommerce/billing-address")));
const PaymentComplete = Loadable(lazy(() => import("@/pages/dashboard/ecommerce/payment-complete"))); // USER PROFILE PAGE

const Profile = Loadable(lazy(() => import("@/pages/dashboard/profile"))); // REACT DATA TABLE PAGE

const DataTable1 = Loadable(lazy(() => import("@/pages/dashboard/data-tables/table-1"))); // OTHER BUSINESS RELATED PAGES

const Career = Loadable(lazy(() => import("@/pages/career/career-1")));
const CareerApply = Loadable(lazy(() => import("@/pages/career/apply")));
const About = Loadable(lazy(() => import("@/pages/about-us/about-us-2")));
const FileManager = Loadable(lazy(() => import("@/pages/dashboard/file-manager"))); // SUPPORT RELATED PAGES

const Support = Loadable(lazy(() => import("@/pages/dashboard/support/support")));
const CreateTicket = Loadable(lazy(() => import("@/pages/dashboard/support/create-ticket"))); // CHAT PAGE

const Chat = Loadable(lazy(() => import("@/pages/dashboard/chat"))); // USER TODO LIST PAGE

const TodoList = Loadable(lazy(() => import("@/pages/dashboard/todo-list"))); // MAIL RELATED PAGES

const Sent = Loadable(lazy(() => import("@/pages/dashboard/email/sent")));
const AllMail = Loadable(lazy(() => import("@/pages/dashboard/email/all")));
const Inbox = Loadable(lazy(() => import("@/pages/dashboard/email/inbox")));
const Compose = Loadable(lazy(() => import("@/pages/dashboard/email/compose")));
const MailDetails = Loadable(lazy(() => import("@/pages/dashboard/email/details")));
export const DashboardRoutes = [{
  path: "dashboard",
  element: <AuthGuard>
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  </AuthGuard>,
  children: [{
    index: true,
    element: <Analytics />
  },
  // {
  //   path: "crm",
  //   element: <CRM />
  // }, {
  //   path: "finance",
  //   element: <Finance />
  // }, {
  //   path: "finance-2",
  //   element: <FinanceV2 />
  // }, {
  //   path: "ecommerce",
  //   element: <Ecommerce />
  // }, {
  //   path: "logistics",
  //   element: <Logistics />
  // }, {
  //   path: "marketing",
  //   element: <Marketing />
  // }, {
  //   path: "analytics-2",
  //   element: <AnalyticsV2 />
  // }, 
  // {
  //   path: "add-user",
  //   element: <AddNewUser />
  // }, {
  //   path: "user-list",
  //   element: <UserListView />
  // }, {
  //   path: "user-grid",
  //   element: <UserGridView />
  // }, {
  //   path: "user-list-2",
  //   element: <UserListView2 />
  // }, {
  //   path: "user-grid-2",
  //   element: <UserGridView2 />
  // }, 
  {
    path: "solar-panel-list",
    element: <SolarPanelList />
  },
  {
    path: "create-solar-panel",
    element: <SolarPanelCreate />
  },
  {
    path: "update-solar-panel/:id",
    element: <SolarPanelUpdate />
  },
  {
    path: "inverter-list",
    element: <InverterList />
  },
  {
    path: "create-inverter",
    element: <InverterCreate />
  },
  {
    path: "update-inverter/:id",
    element: <InverterUpdate />
  },
  {
    path: "structure-list",
    element: <StructureList />
  },
  {
    path: "create-structure",
    element: <StructureCreate />
  },
  {
    path: "update-structure/:id",
    element: <StructureUpdate />
  },
  {
    path: "cabling-list",
    element: <CablingList />
  },
  {
    path: "create-cabling",
    element: <CablingCreate />
  },
  {
    path: "update-cabling/:id",
    element: <CablingUpdate />
  },
  {
    path: "net-metering-list",
    element: <NetMeteringList />
  },
  {
    path: "create-net-metering",
    element: <NetMeteringCreate />
  },
  {
    path: "update-net-metering/:id",
    element: <NetMeteringUpdate />
  },
  {
    path: "installation-list",
    element: <InstallationList />
  },
  {
    path: "create-installation",
    element: <InstallationCreate />
  },
  {
    path: "update-installation/:id",
    element: <InstallationUpdate />
  },
  {
    path: "batteries-list",
    element: <BatteriesList />
  },
  {
    path: "create-batteries",
    element: <BatteriesCreate />
  },
  {
    path: "update-batteries/:id",
    element: <BatteriesUpdate />
  },
  {
    path: "lightning-arrestor-list",
    element: <LightningArrestorList />
  },
  {
    path: "create-lightning-arrestor",
    element: <LightningArrestorCreate />
  },
  {
    path: "update-lightning-arrestor/:id",
    element: <LightningArrestorUpdate />
  },
  {
    path: "expenditure-list",
    element: <ExpenditureList />
  },
  {
    path: "create-expenditure/:id",
    element: <ExpenditureCreate />
  },
  {
    path: "update-expenditure/:id",
    element: <ExpenditureUpdate />
  },
  {
    path: "account",
    element: <Account />
  }, {
    path: "invoice-list",
    element: <InvoiceList />
  },
  {
    path: "create-invoice",
    element: <InvoiceCreate />
  },
  {
    path: "update-invoice/:id",
    element: <InvoiceUpdate />
  },
  // {
  //   path: "product-list",
  //   element: <ProductList />
  // }, {
  //   path: "product-grid",
  //   element: <ProductGrid />
  // }, {
  //   path: "create-product",
  //   element: <ProductCreate />
  // }, {
  //   path: "product-details",
  //   element: <ProductDetails />
  // }, {
  //   path: "cart",
  //   element: <Cart />
  // }, {
  //   path: "payment",
  //   element: <Payment />
  // }, {
  //   path: "billing-address",
  //   element: <BillingAddress />
  // }, {
  //   path: "payment-complete",
  //   element: <PaymentComplete />
  // }, 
  {
    path: "profile",
    element: <Profile />
  }, {
    path: "data-table-1",
    element: <DataTable1 />
  }, {
    path: "about",
    element: <About />
  }, {
    path: "career",
    element: <Career />
  }, {
    path: "career-apply",
    element: <CareerApply />
  }, {
    path: "file-manager",
    element: <FileManager />
  }, {
    path: "support",
    element: <Support />
  }, {
    path: "create-ticket",
    element: <CreateTicket />
  }, {
    path: "chat",
    element: <Chat />
  }, {
    path: "todo-list",
    element: <TodoList />
  }, {
    path: "mail",
    children: [{
      path: "all",
      element: <AllMail />
    }, {
      path: "inbox",
      element: <Inbox />
    }, {
      path: "sent",
      element: <Sent />
    }, {
      path: "compose",
      element: <Compose />
    }, {
      path: "details",
      element: <MailDetails />
    }]
  }]
}];