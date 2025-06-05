import { useState } from "react";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import { Box, Flex, Input, Text } from "@chakra-ui/react";
import { CliTab, CodeTab, PreviewTab, TabbedLayout } from "../../components/common/TabbedLayout";

import CodeExample from "../../components/code/CodeExample";
import PropTable from "../../components/common/PropTable";
import CliInstallation from "../../components/code/CliInstallation";
import PreviewSlider from "../../components/common/PreviewSlider";
import Customize from "../../components/common/Customize";

import GradientText from "../../content/TextAnimations/GradientText/GradientText";
import { gradientText } from '../../constants/code/TextAnimations/gradientTextCode';

const GradientTextDemo = () => {
  const [colors, setColors] = useState('#40ffaa, #4079ff, #40ffaa, #4079ff, #40ffaa');
  const [speed, setSpeed] = useState(3);

  const gradientPreview = colors.split(',').map(color => color.trim());

  const propData = [
    {
      name: 'children',
      type: 'ReactNode',
      default: '-',
      description: 'The content to be displayed inside the gradient text.',
    },
    {
      name: 'className',
      type: 'string',
      default: "''",
      description: 'Adds custom classes to the root element for additional styling.',
    },
    {
      name: 'colors',
      type: 'string[]',
      default: `["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]`,
      description: 'Defines the gradient colors for the text or border.',
    },
    {
      name: 'animationSpeed',
      type: 'number',
      default: '8',
      description: 'The duration of the gradient animation in seconds.',
    },
    {
      name: 'showBorder',
      type: 'boolean',
      default: 'false',
      description: 'Determines whether a border with the gradient effect is displayed.',
    },
  ];

  return (
    <TabbedLayout>
      <PreviewTab>
        <h2 className="demo-title-extra">Default</h2>
        <Box position="relative" className="demo-container" minH={150}>
          <Text fontSize={'2rem'} as='div'>
            <GradientText
              colors={colors.split(',')}
              animationSpeed={speed}
              showBorder={false}
            >
              Add a splash of color!
            </GradientText>
          </Text>
        </Box>

        <h2 className="demo-title-extra">Border Animation</h2>
        <Box position="relative" className="demo-container" minH={150}>
          <Text fontSize={'2rem'} as='div'>
            <GradientText
              colors={colors.split(',')}
              animationSpeed={speed}
              className="custom-gradient-class"
            >
              Now with a cool border!
            </GradientText>
          </Text>
        </Box>

        <Customize>
          <h2 className="demo-title-extra">Customize</h2>
          <Flex gap={6} wrap="wrap" alignItems="flex-start" mt={4} direction="column">
            {/* Colors Input */}
            <Flex gap={4} align="center">
              <Text fontSize="sm">Gradient</Text>
              <Input
                fontSize="xs"
                type="text"
                w="280px"
                h={8}
                px={2}
                onChange={(e) => setColors(e.target.value)}
                value={colors}
              />
              <Box
                bg={`linear-gradient(to right, ${gradientPreview.join(", ")})`}
                w="100px"
                h="28px"
                borderRadius="md"
                border="1px solid #ddd"
              />
            </Flex>

            <PreviewSlider
              title="Speed (s)"
              min={1}
              max={10}
              step={0.5}
              value={speed}
              onChange={setSpeed}
              valueUnit="s"
            />
          </Flex>
        </Customize>

        <p className="demo-extra-info" style={{ marginTop: "1rem" }}>
          <InfoOutlineIcon position="relative" /> For a smoother animation, the gradient should start and end with the same color.
        </p>

        <PropTable data={propData} />
      </PreviewTab>

      <CodeTab>
        <CodeExample codeObject={gradientText} />
      </CodeTab>

      <CliTab>
        <CliInstallation {...gradientText} />
      </CliTab>
    </TabbedLayout>
  );
};

export default GradientTextDemo;
