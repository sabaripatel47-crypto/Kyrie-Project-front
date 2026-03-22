export default {
    inserted(el, binding) {
      const getDropdownWrap = () => {
        const dropdowns = document.querySelectorAll(".el-select-dropdown");
        const dropdown = dropdowns && dropdowns.length ? dropdowns[dropdowns.length - 1] : null;
        const wrap = dropdown ? dropdown.querySelector(".el-select-dropdown__wrap") : null;
        return wrap || null;
      };
  
      const onScroll = function () {
        if (this.scrollHeight - this.scrollTop <= this.clientHeight + 10) {
          if (binding && typeof binding.value === "function") {
            binding.value();
          }
        }
      };
  
      const bindScroll = () => {
        const state = el._elSelectLoadMore;
        if (!state) return;
  
        const wrap = getDropdownWrap();
        if (!wrap) return;
  
        if (state.wrap && state.onScroll) {
          state.wrap.removeEventListener("scroll", state.onScroll);
        }
        state.wrap = wrap;
        state.wrap.addEventListener("scroll", state.onScroll);
      };
  
      const onClick = () => {
        setTimeout(() => {
          bindScroll();
        }, 0);
      };
  
      el._elSelectLoadMore = {
        getDropdownWrap,
        onScroll,
        bindScroll,
        onClick,
        wrap: null,
      };
  
      el.addEventListener("click", onClick);
    },
    unbind(el) {
      const state = el._elSelectLoadMore;
      if (!state) return;
  
      el.removeEventListener("click", state.onClick);
      if (state.wrap && state.onScroll) {
        state.wrap.removeEventListener("scroll", state.onScroll);
      }
      delete el._elSelectLoadMore;
    },
  };
  