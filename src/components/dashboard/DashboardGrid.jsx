import LeftPanel from "./LeftPanel";
import CenterPanel from "./CenterPanel";
import RightPanel from "./RightPanel";
import BottomStatus from "./BottomStatus";

export default function DashboardGrid() {
   return (
      <>
         <div className="dashboard-grid">
            <LeftPanel />

            <CenterPanel />

            <RightPanel />
         </div>

         <BottomStatus />
      </>
   );
}
