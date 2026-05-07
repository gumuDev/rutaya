import type { ThemeConfig } from 'antd';
import { colors } from './colors';

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: colors.primary,
    colorLink: colors.primary,
    colorSuccess: colors.success,
    colorError: colors.error,
    colorWarning: colors.warning,
    colorBgLayout: colors.bg,
    colorBgContainer: colors.bgCard,
    colorBorder: colors.border,
    colorText: colors.textPrimary,
    colorTextSecondary: colors.textSecondary,
    borderRadius: 8,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  components: {
    Button: {
      colorPrimary: colors.primary,
      colorPrimaryHover: colors.primaryHover,
      borderRadius: 8,
    },
    Menu: {
      itemSelectedBg: '#FFF7ED',
      itemSelectedColor: colors.primary,
      itemHoverColor: colors.primary,
    },
    Layout: {
      siderBg: colors.bgCard,
      headerBg: colors.bgCard,
    },
    Statistic: {
      contentFontSize: 24,
    },
  },
};
