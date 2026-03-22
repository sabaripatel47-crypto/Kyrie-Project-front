import { App } from 'vue'
import hasRole from './permission/hasRole'
import hasPermi from './permission/hasPermi'
import copyText from './common/copyText'
import elSelectLoadMore from "./common/elSelectLoadMore";
export default function directive(app: App){
  app.directive("el-select-load-more", elSelectLoadMore);
  app.directive('hasRole', hasRole)
  app.directive('hasPermi', hasPermi)
  app.directive('copyText', copyText)
}
