import { extend } from 'flarum/common/extend';
import ItemList from 'flarum/common/utils/ItemList';
import app from 'flarum/forum/app';
import IndexPage from 'flarum/forum/components/IndexPage';
import DiscussionListState from 'flarum/forum/states/DiscussionListState';
import GlobalSearchState from 'flarum/forum/states/GlobalSearchState';

import LinkButton from 'flarum/forum/components/LinkButton';
import Link from 'flarum/forum/components/Link';

import TagsFilter from './components/UserAutocompleteDropdown';

import Search from 'flarum/forum/components/Search';
import DiscussionsSearchSource from 'flarum/forum/components/DiscussionsSearchSource';
import DiscussionHero from 'flarum/forum/components/DiscussionHero';


import type Mithril from 'mithril';

app.initializers.add('tohsakarat/tags-filter', () => {

  extend(IndexPage.prototype, 'viewItems', function (items: ItemList<Mithril.Children>) {
    if (app.current.data.routeName === 'byobuPrivate') return;

      items.add('tagsFilter', <TagsFilter />, -15);
    //if (!!app.forum.attribute('canUseBlomstraUserFilter')) {
    //}
  });
  
  
  extend(IndexPage.prototype, 'viewItems', function (items: ItemList<Mithril.Children>) {
        items.add('search', <Search state={app.search} />, -16);
 
    });
  extend(DiscussionsSearchSource.prototype, 'view', function (items: ItemList<Mithril.Children>,query) {
   

        let exp = /^[+-]?\d*(\.\d*)?(e[+-]?\d+)?$/
         
        //console.log(exp.test(query))
       
        //console.log(items)
       //// console.log(items)
       items[1]=<li>
        <LinkButton icon="fas fa-search" href={app.route(app.current.get('routeName'), {  ...m.route.param(),q: query })}>
          {app.translator.trans('core.forum.search.all_discussions_button', { query })}
        </LinkButton>
      </li>
      
       if(!exp.test(query))return;
        items.unshift(
            <li>
                <LinkButton icon="fas fa-right" href={app.route('discussion', { id: query })}>
                  {app.translator.trans('tohsakarat-tags-filter.forum.index_page.filter_tags.link-button')+' '+query}
                </LinkButton>
             </li>
        );
 
    });
    
  extend(DiscussionHero.prototype, 'items', function (items: ItemList<Mithril.Children>,query) {
   

       
    if(!app.current?.data?.discussion?.data?.id)return
        items.add('id',
           
                <span icon="fas fa-right">
                <i class="fas fa-right" />
                  {app.translator.trans('ID = '+ app.current?.data?.discussion?.data?.id)}
                </span>
               ,-15
                
             
        );
 
    });


 
});
