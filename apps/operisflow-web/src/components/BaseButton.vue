<script setup lang="ts">
import { computed } from "vue";

interface Props {
  label?: string;
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger";
  fullWidth?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  label: "",
  loading: false,
  disabled: false,
  type: "button",
  variant: "primary",
  fullWidth: false,
});

const isDisabled = computed(() => props.disabled || props.loading);

const classes = computed(() => {
  const base =
    "base-btn inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all duration-150";

  const width = props.fullWidth ? " base-btn--full" : "";

  const variants: Record<string, string> = {
    primary: " base-btn--primary",
    secondary: " base-btn--secondary",
    danger: " base-btn--danger",
  };

  return base + width + (variants[props.variant] ?? variants.primary);
});
</script>

<template>
  <button
    :type="type"
    :class="classes"
    :disabled="isDisabled"
  >
    <!-- Spinner -->
    <span v-if="loading" class="base-btn__spinner" />

    <!-- Texto / slot -->
    <span>
      <slot>
        {{ loading ? "Carregando..." : label }}
      </slot>
    </span>
  </button>
</template>

<style scoped>
.base-btn {
  min-height: 40px;
  padding: 0 14px;
  font-size: 14px;
  border: none;
  cursor: pointer;
  box-shadow: 0 8px 18px rgba(37, 99, 235, 0.35);
}

.base-btn--full {
  width: 100%;
}

/* Variantes */
.base-btn--primary {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #ffffff;
}

.base-btn--primary:hover:enabled {
  background: linear-gradient(135deg, #1d4ed8, #1e40af);
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(37, 99, 235, 0.4);
}

.base-btn--primary:active:enabled {
  transform: translateY(0);
  box-shadow: 0 6px 14px rgba(37, 99, 235, 0.3);
}

.base-btn--secondary {
  background: #ffffff;
  color: #111827;
  border: 1px solid #d1d5db;
  box-shadow: none;
}

.base-btn--secondary:hover:enabled {
  background: #f3f4f6;
}

.base-btn--danger {
  background: #dc2626;
  color: #ffffff;
}

.base-btn--danger:hover:enabled {
  background: #b91c1c;
}

/* Desabilitado */
.base-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  box-shadow: none;
}

/* Spinner */
.base-btn__spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: base-btn-spin 0.6s linear infinite;
}

.base-btn--secondary .base-btn__spinner {
  border-color: rgba(37, 99, 235, 0.4);
  border-top-color: #2563eb;
}

@keyframes base-btn-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>