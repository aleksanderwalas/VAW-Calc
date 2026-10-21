# VAW Calc - System Instructions

## Project Overview
- **Name:** VAW Calc (Aleksander Walas)
- **Description:** Professional mobile application for electricians and installers.
- **Technology Stack:** React Native, Expo v57.
- **Environment:** Ubuntu (WSL) on Windows 11.
- **Deployment/Preview:** LAN mode for mobile device preview.

## Current Goals
- **Current Phase:** Phase 2 - Photovoltaics (PV) Module (Completed core features).
- **Recent Updates:** Advanced AC Cable sizing, Reception Checklist Assistant, Licensing System, Rebranding to VAW Calc.
- **Focus Areas:**
  - String configuration calculator (Voc/Vmp/Isc parameters).
  - Temperature influence calculations (Voc Cold / Vmp Hot).
  - Inverter sizing and DC/AC ratio.
  - DC Cable calculations.
  - Yield estimations.
  - AC Cable sizing with Ib, Iz, and delta U considerations.
  - Installation commissioning assistant.

## Coding Standards
- Use `react-native-paper` for UI components.
- Use `lucide-react-native` for icons.
- Use `VAWLogo.js` for branding.
- Follow existing patterns in `src/components/PV` and `src/utils/pvCalculations.js`.
- Keep the dark theme consistency (`src/theme/theme.js`).
- Reference code as `file_path:line_number`.

## Important Rules
- Always read this file at the start of a session.
- Maintain professional tone in UI (Polish language for the end user).
- Ensure all calculations are physically and electrically correct according to standards (PN-HD 60364-7-712, IEC 62548, PN-HD 60364-5-52).
- Brand name is "VAW Calc", author: Aleksander Walas.
