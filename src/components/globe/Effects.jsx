// Effects.jsx
import React from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

export const Effects = () => {
   return (
      <EffectComposer disableNormalPass>
         <Bloom
            mipmapBlur // Biar pendarannya halus dan pudar (haloing)
            luminanceThreshold={0.05} // Sangat sensitif, warna apa aja yang cerah bakal ngeglow
            luminanceSmoothing={0.8}
            intensity={2.8} // Menaikkan kekuatan neon parah
         />
      </EffectComposer>
   );
};

export default Effects;
