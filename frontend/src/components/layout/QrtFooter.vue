<script setup lang="ts">
// Không cần defineProps nếu không có props
</script>

<template>
    <div style="height: 50px;"></div>
    <!--
    <footer class="footer">
      <div class="content has-text-centered">
        <p>
          <strong>QR Table</strong> by <a href="#">Duong</a>.
        </p>
      </div>
    </footer>
    -->
</template>

<style scoped>
/* Bạn có thể bật footer này lên sau nếu muốn cố định footer hoặc thêm style */
.footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 1rem 0;
    background: var(--bulma-background, #f9f9f9);
    color: var(--bulma-text, #333);
    text-align: center;
    border-top: 1px solid #ddd;
}
</style>