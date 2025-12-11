import { useTranslation } from "react-i18next";
import { createToolFlow } from "@app/components/tools/shared/createToolFlow";
import { useTextOutliningParameters } from "@app/hooks/tools/textOutlining/useTextOutliningParameters";
import { useTextOutliningOperation } from "@app/hooks/tools/textOutlining/useTextOutliningOperation";
import { useBaseTool } from "@app/hooks/tools/shared/useBaseTool";
import { BaseToolProps, ToolComponent } from "@app/types/tool";
import { useTextOutliningTips } from "@app/components/tooltips/useTextOutliningTips";
import { Alert } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";

const TextOutlining = (props: BaseToolProps) => {
  const { t } = useTranslation();
  const textOutliningTips = useTextOutliningTips();

  const base = useBaseTool(
    'textOutlining',
    useTextOutliningParameters,
    useTextOutliningOperation,
    props
  );

  return createToolFlow({
    files: {
      selectedFiles: base.selectedFiles,
      isCollapsed: base.hasResults,
    },
    steps: [
      {
        title: t("textOutlining.steps.info", "Information"),
        isCollapsed: base.settingsCollapsed,
        onCollapsedClick: base.settingsCollapsed ? base.handleSettingsReset : undefined,
        tooltip: textOutliningTips,
        content: (
          <Alert color="blue" variant="light">
            {t("textOutlining.options.note", "This tool converts all text in your PDF to vector outlines. Text will look the same but will no longer be selectable or editable. This ensures your document looks identical on any computer, regardless of installed fonts.")}
          </Alert>
        ),
      },
    ],
    executeButton: {
      text: t("textOutlining.submit", "Convert to Outlines"),
      isVisible: !base.hasResults,
      loadingText: t("loading"),
      onClick: base.handleExecute,
      disabled: !base.params.validateParameters() || !base.hasFiles || !base.endpointEnabled,
    },
    review: {
      isVisible: base.hasResults,
      operation: base.operation,
      title: t("textOutlining.results.title", "Text Outlining Results"),
      onFileClick: base.handleThumbnailClick,
      onUndo: base.handleUndo,
    },
  });
};

export default TextOutlining as ToolComponent;
