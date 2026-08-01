import Sidebar from "../sidebar/Sidebar";
import Topbar from "../topbar/Topbar";

export default function DashboardLayout({ children }) {
   return (
      <div className="dashboard">
         <Sidebar />

         <div className="main">
            <Topbar />

            {children}
         </div>
      </div>
   );
}
