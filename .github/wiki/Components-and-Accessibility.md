# Components and accessibility

The [live catalogue](https://prabhuvajjiram.github.io/agis/site/) demonstrates the component families across all four
themes. Use it alongside the behavior contracts below.

| Family | Guidance |
| --- | --- |
| Fields, validation and form layout | [Forms](https://github.com/prabhuvajjiram/agis/blob/main/docs/FORMS.md) |
| Primary, secondary and destructive actions | [Actions](https://github.com/prabhuvajjiram/agis/blob/main/docs/ACTIONS.md) |
| Select and searchable pickers | [Selection](https://github.com/prabhuvajjiram/agis/blob/main/docs/SELECTION.md) |
| Checkbox, radio and switch | [Choices](https://github.com/prabhuvajjiram/agis/blob/main/docs/CHOICES.md) |
| Module rails, navigation, tabs and pagination | [Navigation](https://github.com/prabhuvajjiram/agis/blob/main/docs/NAVIGATION.md) |
| Cards, descriptions and tables | [Data display](https://github.com/prabhuvajjiram/agis/blob/main/docs/DATA_DISPLAY.md) |
| Disclosure, tooltips and popovers | [Disclosure](https://github.com/prabhuvajjiram/agis/blob/main/docs/DISCLOSURE.md) |
| Upload and date/time controls | [Specialized inputs](https://github.com/prabhuvajjiram/agis/blob/main/docs/SPECIALIZED_INPUTS.md) |
| Menus and dialogs | [Overlays](https://github.com/prabhuvajjiram/agis/blob/main/docs/OVERLAYS.md) |
| Alerts, status, loading and recovery | [Feedback](https://github.com/prabhuvajjiram/agis/blob/main/docs/FEEDBACK.md) |

## Quality expectations

WCAG 2.1 AA is the minimum target. Provide semantic controls, keyboard access, visible
focus, useful labels, readable contrast and responsive reflow. Use native controls where
appropriate; CSS alone cannot supply interaction behavior or authorization.

Automated checks cover regressions, including Axe, keyboard interactions, contrast and
responsive visual references. Human screen-reader and platform checks remain separately
recorded. Review [the accessibility standard](https://github.com/prabhuvajjiram/agis/blob/main/docs/ACCESSIBILITY.md)
and [release evidence](https://github.com/prabhuvajjiram/agis/tree/main/docs/releases) before making conformance claims.

The [coverage matrix](https://github.com/prabhuvajjiram/agis/blob/main/docs/COMPONENT_STATUS.md) distinguishes implemented
patterns from remaining product verification.
