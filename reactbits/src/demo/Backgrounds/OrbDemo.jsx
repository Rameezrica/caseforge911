import { useState } from "react";
import { CodeTab, PreviewTab, CliTab, TabbedLayout } from "../../components/common/TabbedLayout";
import { Box, Text } from "@chakra-ui/react";
import { useDebounce } from "react-haiku";

import CodeExample from "../../components/code/CodeExample";
import CliInstallation from "../../components/code/CliInstallation";
import PropTable from "../../components/common/PropTable";
import Dependencies from '../../components/code/Dependencies';
import PreviewSlider from "../../components/common/PreviewSlider";
import PreviewSwitch from "../../components/common/PreviewSwitch";
import Customize from "../../components/common/Customize";

import Orb from "../../content/Backgrounds/Orb/Orb";
import { orb } from "../../constants/code/Backgrounds/orbCode";

const OrbDemo = () => {
  const [hue, setHue] = useState(0);
  const [hoverIntensity, setHoverIntensity] = useState(0.5)
  const [rotateOnHover, setRotateOnHover] = useState(true);
  const [forceHoverState, setForceHoverState] = useState(false)

  const debouncedHue = useDebounce(hue, 300);
  const debouncedHoverIntensity = useDebounce(hoverIntensity, 300);

  const propData = [
    {
      name: "hue",
      type: "number",
      default: "0",
      description: "The base hue for the orb (in degrees)."
    },
    {
      name: "hoverIntensity",
      type: "number",
      default: "0.2",
      description: "Controls the intensity of the hover distortion effect."
    },
    {
      name: "rotateOnHover",
      type: "boolean",
      default: "true",
      description: "Toggle to enable or disable continuous rotation on hover."
    },
    {
      name: "forceHoverState",
      type: "boolean",
      default: "false",
      description: "Force hover animations even when the orb is not actually hovered."
    }
  ];

  return (
    <TabbedLayout>
      <PreviewTab>
        <Box position="relative" className="demo-container" h={500} p={0} overflow="hidden">
          <Orb
            hoverIntensity={debouncedHoverIntensity}
            rotateOnHover={rotateOnHover}
            hue={debouncedHue}
            forceHoverState={forceHoverState}
          />

          <Text position="absolute" zIndex={0} fontSize="clamp(2rem, 2vw, 6rem)" fontWeight={900} mb={0} mixBlendMode="difference">
            Hover.
          </Text>
        </Box>

        <Customize>
          <PreviewSlider
            title="Hue Shift"
            min={0}
            max={360}
            step={1}
            value={hue}
            onChange={setHue}
          />

          <PreviewSlider
            title="Hover Intensity"
            min={0}
            max={5}
            step={0.01}
            value={hoverIntensity}
            onChange={setHoverIntensity}
          />

          <PreviewSwitch
            title="Rotate On Hover"
            isChecked={rotateOnHover}
            onChange={(e) => setRotateOnHover(e.target.checked)}
          />

          <PreviewSwitch
            title="Force Hover State"
            isChecked={forceHoverState}
            onChange={(e) => setForceHoverState(e.target.checked)}
          />
        </Customize>

        <PropTable data={propData} />
        <Dependencies dependencyList={['ogl']} />
      </PreviewTab>

      <CodeTab>
        <CodeExample codeObject={orb} />
      </CodeTab>

      <CliTab>
        <CliInstallation {...orb} />
      </CliTab>
    </TabbedLayout>
  );
};

export default OrbDemo;