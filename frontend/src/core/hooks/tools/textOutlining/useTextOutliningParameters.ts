import { BaseParameters } from '@app/types/parameters';
import { useBaseParameters, BaseParametersHook } from '@app/hooks/tools/shared/useBaseParameters';

export interface TextOutliningParameters extends BaseParameters {
  // No additional parameters - simple tool
}

export const defaultParameters: TextOutliningParameters = {};

export type TextOutliningParametersHook = BaseParametersHook<TextOutliningParameters>;

export const useTextOutliningParameters = (): TextOutliningParametersHook => {
  return useBaseParameters({
    defaultParameters,
    endpointName: 'text-outlining',
    validateFn: () => true, // Always valid - no parameters to validate
  });
};
