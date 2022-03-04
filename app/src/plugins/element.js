import Vue from 'vue';
import {
  Button,
  Upload,
  Message,
  Progress,
  Table,
  TableColumn,
  Input,
  Select,
  Option,
  Row,
  Col,
  Form,
  FormItem,
  Dialog,
  MessageBox,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DatePicker,
  Alert
} from 'element-ui';

Vue.use(Button);
Vue.use(Upload);
Vue.use(Progress);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Input);
Vue.use(Select);
Vue.use(Option);
Vue.use(Row);
Vue.use(Col);
Vue.use(Form);
Vue.use(Dialog);
Vue.use(FormItem);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(DatePicker);
Vue.use(Alert);
Vue.prototype.$message = Message;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$confirm = MessageBox.confirm;