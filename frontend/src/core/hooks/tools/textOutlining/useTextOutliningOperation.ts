import { useTranslation } from 'react-i18next';
import { useToolOperation, ToolType } from '@app/hooks/tools/shared/useToolOperation';
import { createStandardErrorHandler } from '@app/utils/toolErrorHandler';
import { TextOutliningParameters, defaultParameters } from '@app/hooks/tools/textOutlining/useTextOutliningParameters';

// Static configuration that can be used by both the hook and automation executor
export const buildTextOutliningFormData = (parameters: TextOutliningParameters, file: File): FormData => {
  const formData = new FormData();
  formData.append("fileInput", file);
  return formData;
};

// Static configuration object
export const textOutliningOperationConfig = {
  toolType: ToolType.singleFile,
  buildFormData: buildTextOutliningFormData,
  operationType: 'textOutlining',
  endpoint: '/api/v1/misc/text-outlining',
  defaultParameters,
} as const;

export const useTextOutliningOperation = () => {
  const { t } = useTranslation();

  return useToolOperation<TextOutliningParameters>({
    ...textOutliningOperationConfig,
    getErrorMessage: createStandardErrorHandler(t('textOutlining.error.failed', 'An error occurred while converting text to outlines.'))
  });
};
