# Widget Settings Loader

Loads widget settings from YAML files and converts to JSON Schema for validation.

## Usage

### 1. Create Widget Settings YAML

```yaml
# product-table-widget-settings.yaml
schema:
  type: object
  properties:
    display:
      type: object
      title: Display Settings
      properties:
        showCode:
          type: boolean
          title: Show Product Code
          default: true
        compactMode:
          type: boolean
          title: Compact Mode
          default: false
    refresh:
      type: object
      title: Refresh Settings
      properties:
        interval:
          type: number
          title: Refresh Interval (seconds)
          minimum: 5
          maximum: 300
          default: 30

defaults:
  display:
    showCode: true
    compactMode: false
  refresh:
    interval: 30
```

### 2. Load in Plugin Backend

```go
package main

import (
    "github.com/NubeDev/rubix-plugin/widgetsettings"
)

func (p *PLMPlugin) WidgetSettingsSchema(widgetID string) (map[string]interface{}, error) {
    // Load from file next to binary
    schemaFile := "./product-table-widget-settings.yaml"
    schema, err := widgetsettings.LoadFromFile(schemaFile)
    if err != nil {
        return nil, err
    }
    return schema, nil
}
```

### 3. Widget Receives Settings

```tsx
interface WidgetProps {
  orgId: string;
  deviceId: string;
  settings?: {
    display?: {
      showCode?: boolean;
      compactMode?: boolean;
    };
    refresh?: {
      interval?: number;
    };
  };
}

export default function Widget({ settings }: WidgetProps) {
  const showCode = settings?.display?.showCode ?? true;
  const interval = (settings?.refresh?.interval ?? 30) * 1000;

  // Use settings...
}
```

## Benefits

- ✅ **Easy editing** - YAML is human-friendly
- ✅ **Validation** - Converted to JSON Schema for validation
- ✅ **Defaults** - Separate defaults section
- ✅ **Reusable** - Same library for all plugins
- ✅ **Type-safe** - JSON Schema ensures correct types

## File Location

Place YAML file in plugin directory:
```
bin/orgs/{orgId}/plugins/nube.plm/
├── nube.plm
├── plugin.json
└── product-table-widget-settings.yaml  ← Here
```

Backend loads it at runtime.
