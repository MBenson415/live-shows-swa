<template>
  <div class="sidebar">
    <ul class="sidebar-list">
      <!--
      <li>
        <router-link to="/page1">Page 1</router-link>
      </li>
      <li>
        <router-link to="/page2">Page 2</router-link>
      </li>
      <li>
        <router-link to="/page3">Page 3</router-link>
      </li>
      -->
      <li class="sidebar-list-item">
        <router-link class="sidebar-link-container" to="/bands"><div class="sidebar-link">Bands</div></router-link>
      </li>
      <li class="sidebar-list-item">
        <router-link class="sidebar-link-container" to="/venues"><div class="sidebar-link">Venues</div></router-link>
      </li>
      <li class="sidebar-list-item">
        <router-link class="sidebar-link-container" to="/events"><div class="sidebar-link">Events</div></router-link>
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