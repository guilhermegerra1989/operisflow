<script setup lang="ts">
interface Props {
  label?: string;
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const props = withDefaults(defineProps<Props>(), {
  label: "",
  loading: false,
  disabled: false,
  type: "button",
});
</script>

<template>
  <button
    :type="type"
    class="base-btn"
    :disabled="disabled || loading"
  >
    <span v-if="loading" class="base-btn-spinner"></span>
    <span>{{ loading ? "Entrando..." : label }}</span>
  </button>
</template>

<style scoped>
.base-btn {
  width: 100%;                 /* 👈 mantém igual ao que você tinha */
  padding: 12px 14px;
  font-size: 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #ffffff;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: opacity 0.2s;
}

.base-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Spinner */
.base-btn-spinner {
  width: 18px;
  height: 18px;
  border: 3px solid rgba(255, 255, 255, 0.4);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
