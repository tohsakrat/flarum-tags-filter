import { extend } from 'flarum/common/extend';
import ItemList from 'flarum/common/utils/ItemList';
import app from 'flarum/forum/app';
import IndexPage from 'flarum/forum/components/IndexPage';
import DiscussionListState from 'flarum/forum/states/DiscussionListState';
import GlobalSearchState from 'flarum/forum/states/GlobalSearchState';

import UserAutocompleteDropdown from './components/UserAutocompleteDropdown';

import type Mithril from 'mithril';

app.initializers.add('tohsakarat/tags-filter', () => {

  extend(IndexPage.prototype, 'viewItems', function (items: ItemList<Mithril.Children>) {
    if (app.current.data.routeName === 'byobuPrivate') return;

      items.add('tagsFilter', <UserAutocompleteDropdown />, -15);
    //if (!!app.forum.attribute('canUseBlomstraUserFilter')) {
    //}
  });

 
});
