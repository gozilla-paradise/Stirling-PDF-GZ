import { useTranslation } from 'react-i18next';
import { TooltipContent } from '@app/types/tips';

export const useTextOutliningTips = (): TooltipContent => {
  const { t } = useTranslation();

  return {
    header: {
      title: t("textOutlining.tooltip.header.title", "Text Outlining Overview")
    },
    tips: [
      {
        title: t("textOutlining.tooltip.description.title", "What does this do?"),
        description: t("textOutlining.tooltip.description.text", "Converts all text in your PDF into vector shapes (outlines). The text will look exactly the same, but it becomes part of the page graphics rather than actual text."),
        bullets: [
          t("textOutlining.tooltip.description.bullet1", "Text appearance is preserved perfectly"),
          t("textOutlining.tooltip.description.bullet2", "No font dependencies - looks the same everywhere")
        ]
      },
      {
        title: t("textOutlining.tooltip.whenToUse.title", "When should I use this?"),
        description: t("textOutlining.tooltip.whenToUse.text", "Use this when you need to ensure your PDF looks identical on any computer, or when sharing documents that use special fonts others may not have installed."),
        bullets: [
          t("textOutlining.tooltip.whenToUse.bullet1", "Sharing with others who may lack your fonts"),
          t("textOutlining.tooltip.whenToUse.bullet2", "Preparing files for professional printing"),
          t("textOutlining.tooltip.whenToUse.bullet3", "Creating final versions that shouldn't be edited")
        ]
      },
      {
        title: t("textOutlining.tooltip.note.title", "Important Note"),
        description: t("textOutlining.tooltip.note.text", "After conversion, text cannot be selected, searched, or edited. This is a one-way process, so keep your original file if you need to make changes later.")
      }
    ]
  };
};
