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
export default {
  name: "Sidebar",
};
</script>

<style scoped>
.sidebar {
  width: 200px;
  background: #f0f0f0;
  padding: 1rem;
  height: 100vh;
  position: absolute;
  left: 0;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin: 1rem 0;
}
a {
  text-decoration: none;
  color: #333;
}
a.router-link-active {
  font-weight: bold;
}
</style>
