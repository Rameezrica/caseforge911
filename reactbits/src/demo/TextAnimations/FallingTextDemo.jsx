import { useState } from "react";
import { CodeTab, PreviewTab, CliTab, TabbedLayout } from "../../components/common/TabbedLayout";
import { Flex, Text, FormControl, FormLabel, Select } from "@chakra-ui/react";

import useForceRerender from "../../hooks/useForceRerender";
import PreviewSlider from "../../components/common/PreviewSlider";
import Customize from "../../components/common/Customize";
import CodeExample from "../../components/code/CodeExample";
import CliInstallation from "../../components/code/CliInstallation";
import PropTable from "../../components/common/PropTable";
import Dependencies from '../../components/code/Dependencies';

import FallingText from "../../content/TextAnimations/FallingText/FallingText";
import { fallingText } from "../../constants/code/TextAnimations/fallingTextCode";

const FallingTextDemo = () => {
  const [gravity, setGravity] = useState(0.56);
  const [mouseConstraintStiffness, setMouseConstraintStiffness] = useState(0.9);
  const [trigger, setTrigger] = useState("hover");

  const [key, forceRerender] = useForceRerender();

  const propData = [
    {
      name: "text",
      type: "string",
      default: '',
      description: "The text content to display and eventually animate."
    },
    {
      name: "highlightWords",
      type: "string[]",
      default: '[]',
      description: "List of words or substrings to apply a highlight style."
    },
    {
      name: "highlightClass",
      type: "string",
      default: `"highlighted"`,
      description: "CSS class name for highlighted words."
    },
    {
      name: "trigger",
      type: "'click' | 'hover' | 'auto' | 'scroll'",
      default: `"click"`,
      description: "Defines how the falling effect is activated."
    },
    {
      name: "backgroundColor",
      type: "string",
      default: `"transparent"`,
      description: "Canvas background color for the physics world."
    },
    {
      name: "wireframes",
      type: "boolean",
      default: "false",
      description: "Whether to render the physics bodies in wireframe mode."
    },
    {
      name: "gravity",
      type: "number",
      default: "1",
      description: "Vertical gravity factor for the physics engine."
    },
    {
      name: "mouseConstraintStiffness",
      type: "number",
      default: "0.2",
      description: "Stiffness for the mouse drag constraint."
    },
    {
      name: "fontSize",
      type: "string",
      default: `"1rem"`,
      description: "Font size applied to the text before it falls."
    },
    {
      name: "wordSpacing",
      type: "string",
      default: `"2px"`,
      description: "Horizontal spacing between each word."
    }
  ];

  return (
    <TabbedLayout>
      <PreviewTab>
        <Flex position="relative" className="demo-container" h={400} overflow="hidden" justifyContent="center" alignItems="center" p={0}>
          <FallingText
            key={key}
            text={`React Bits is a library of animated and interactive React components designed to streamline UI development and simplify your workflow.`}
            highlightWords={["React", "Bits", "animated", "components", "simplify"]}
            highlightClass="highlighted"
            trigger={trigger}
            gravity={gravity}
            fontSize="2rem"
            mouseConstraintStiffness={mouseConstraintStiffness}
          />

          <Text color="#222" fontSize='4rem' fontWeight={900} position="absolute" zIndex={0} userSelect="none">
            {trigger === "hover" ? "Hover Me" : trigger === "click" ? "Click Me" : "Auto Start"}
          </Text>
        </Flex>

        <Customize>
          <FormControl width="auto">
            <Flex alignItems={"center"} gap={2} mb={4}>
              <FormLabel fontSize="sm" margin={0}>Trigger</FormLabel>
              <Select
                width="150px"
                value={trigger}
                onChange={(e) => {
                  setTrigger(e.target.value);
                  forceRerender();
                }}
              >
                <option value="hover">Hover</option>
                <option value="click">Click</option>
                <option value="auto">Auto</option>
                <option value="scroll">Scroll</option>
              </Select>
            </Flex>
          </FormControl>

          <PreviewSlider
            title="Gravity"
            min={0.1}
            max={2}
            step={0.01}
            value={gravity}
            onChange={(val) => {
              setGravity(val);
              forceRerender();
            }}
          />

          <PreviewSlider
            title="Mouse Constraint Stiffness"
            min={0.1}
            max={2}
            step={0.1}
            value={mouseConstraintStiffness}
            onChange={(val) => {
              setMouseConstraintStiffness(val);
              forceRerender();
            }}
          />
        </Customize>

        <PropTable data={propData} />
        <Dependencies dependencyList={['matter-js']} />
      </PreviewTab>

      <CodeTab>
        <CodeExample codeObject={fallingText} />
      </CodeTab>

      <CliTab>
        <CliInstallation {...fallingText} />
      </CliTab>
    </TabbedLayout>
  );
};

export default FallingTextDemo;