<template>
  <div class="sidebar">
    <ul>
      <li>
        <router-link to="/page1">Page 1</router-link>
      </li>
      <li>
        <router-link to="/page2">Page 2</router-link>
      </li>
      <li>
        <router-link to="/page3">Page 3</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import "./Sidebar.css"
export default {
  name: "Sidebar",
};
</script>
