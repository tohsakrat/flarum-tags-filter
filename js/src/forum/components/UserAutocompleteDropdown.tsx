import Component from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import Dropdown from 'flarum/common/components/Dropdown';
import Separator from 'flarum/common/components/Separator';
import extractText from 'flarum/common/utils/extractText';
import app from 'flarum/forum/app';

import type Mithril from 'mithril';
import Stream from 'flarum/common/utils/Stream';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';

interface IAttrs {}

interface IState {
	currentData: [];
	value: Stream < string > ;
	label: Stream < string > ;
	searchQuery: Stream < string > ;
	lastSearchedQuery: string;
	loading: boolean;
	timeoutKey: number | null;
}

const DEBOUNCE_TIME = 250;

export default class UserAutocompleteDropdown extends Component < IAttrs, IState > {
	oninit(vnode: Mithril.Vnode < IAttrs, this > ): void {
		super.oninit(vnode);
		
		
		this.state = {
			currentData: [],
			value: Stream(''),
			searchQuery: Stream(''),
			lastSearchedQuery: '',
			loading: false,
			timeoutKey: null,
			selectedTags: [],
			selectedTagsStr: '',
			tagList: [],
			tagListr: [],
			tagView: [],
			label:'All'
		};
		window.thisTag=this;
		app.store.find('tags')
		.then((v) => {
			this.state.tagList = v.map(d => d.data).sort((a,b)=>{return b.attributes.discussionCount-a.attributes.discussionCount});
			this.state.tagListr = this.state.tagList.map((d) => {

				var z = JSON.parse(JSON.stringify(d));
				z.attributes = JSON.stringify(z.attributes);
				return z;
			})
			m.redraw();
		});
	}


	refreshTagView(){
	
	
		this.state.tagView = JSON.parse(JSON.stringify(this.state.tagList));
		this.state.selectedTags.map((e)=>{
			this.state.tagView=this.state.tagView.filter((w)=>{return w.id!=e.id})
			if(e.attributes.isChild==false && e.attributes.position!=null){ //为根目录
			
				this.state.tagView=this.state.tagView.filter((w)=>{
			
				if(w.attributes.isChild){
						if(w.relationships.parent.data.id==e.id)return true;
						return false;
					}
					else{
						if(w.attributes.position!=null)return false;
					}
					return true;
				}) 
			}
			
			if(e.attributes.isChild==true){ //为子目录
			
				this.state.tagView=this.state.tagView.filter((w)=>{
			
				if(w.attributes.isChild){
						if(w.relationships.parent.data.id==e.relationships.parent.data.id)return true;
						return false;
					}
					else{
						if(w.attributes.position!=null)return false;
					}
					return true;
				}) 
			}
			
			
			
		})
 		this.state.tagView = this.state.tagView.sort((a,b)=>{
			function score(o){
				let score=100000;
				if(o.attributes.position!=null && o.attributes.isChild==false) score= 1000 * o.attributes.position;
				if(o.attributes.position!=null && o.attributes.isChild==true){
					score = 100 * o.attributes.position + 1000 * window.thisTag.state.tagList.filter((l) => {
						return l.id == o.relationships.parent.data.id
						})[0].attributes.position
					}
					score  = score - o.attributes.discussionCount
					return score;
				}
			let scoreA=score(a)
			let scoreB=score(b)
			//console.log(scoreB - scoreA)
			return  scoreA - scoreB
		}); 	
		m.redraw();
		}


	view() {
		this.performSearch(this.state.searchQuery());

		let content = [];
		
		
		this.refreshTagView()
		
		function renderTag( data ){
			return data?.map((e) => {
			if(!e)return;
			let weight1= (e.attributes.position!=null && e.attributes.isChild==false)?600:400
			let weight2=(e.attributes.position!=null && e.attributes.isChild==false)?400:200
			
			
			return (
			
			<Button
            class={ ["TohsakaratTagsFilter-item Button ",e.attributes.color?"colored":"",e.attributes.description?"description":""] }
			style = {{'--tag-title-color':e.attributes.color?e.attributes.color:'var(--tag-color)'}}
            onclick={() => {
			//选中tag
              window.thisTag.handleTagsChange(e.attributes.slug);
            }}
			>
			
			   <span class='SelectTagListItem-name' 
			   style = {{fontWeight : weight1}}
			   >
				   <span class={"icon "+(e.attributes.icon?e.attributes.icon:"TagIcon")} ></span> 
				   {e.attributes.name}
				</span>
				
			   <span class='SelectTagListItem-description' 
			   style = {{fontWeight :weight2}} > {e.attributes.description}
			   </span>
		   
			</Button>
			
			
				)})
		}
		
		if (this.state.loading) {
			content.push(<LoadingIndicator />);
		} 
		else if ( Number(this.state.searchQuery().length) ==0 ) {//< this.minSearchLength()
			this.state.lastSearchedQuery = '';
			content.push(
			
			<div class='tohsakarat-selectTagsTab'>{
			
			renderTag(this.state.tagView)

				}
			</div>)
			// content.push(
				// <span>
				  // {extractText(
					// app.translator.trans(
					  // `tohsakarat-tags-filter.forum.index_page.filter_tags.${this.state.searchQuery().length === 0 ? 'start_typing' : 'keep_typing'}`
					// )
				  // )}
				// </span>

			//);
			

		} else if (!this.state.currentData?.length) {

			content.push(<span>{extractText(app.translator.trans('tohsakarat-tags-filter.forum.index_page.filter_tags.no_results'))}</span>);

		} else {
			
			content.push(
			<div class='tohsakarat-selectTagsTab'>
			{
			
			renderTag(this.state.currentData)
				
				}
				
			</div>
				
			);
		}

		if (app.search.params().q) {
			// if author is set
			content.push(
				<Separator />,
				<Button class="Button" icon="fas fa-times" onclick={() => this.handleTagsChange(null)}>
				{extractText(app.translator.trans('tohsakarat-tags-filter.forum.index_page.filter_tags.remove_filter'))}
        </Button>
			);
		}


		return (
		<Dropdown
        buttonClassName="Button"
        updateOnClose
		label={this.label}
        accessibleToggleLabel={app.translator.trans('tohsakarat-tags-filter.forum.index_page.filter_tags.accessible_label')}
        onshow={() => {
          $('input').focus();
        }}
      >
	  <span class='TagsLabel '>
	  
	  {
		  this.state.selectedTags.map((e)=>{
		  return <span  class={  "TagLabel  " + (e.attributes.color ?"colored":" ") } 
		  style={
		  {background:e.attributes.color,
		  }} 
		  onclick={()=>{this.removeTag(e.attributes.slug)}}     >{e.attributes.name}</span>})
	  }
	  </span>
        <input
          type="text"
          class="FormControl"
          placeholder={extractText(app.translator.trans('tohsakarat-tags-filter.forum.index_page.filter_tags.comment_filter'))}
          value={this.state.value()}
          oninput={(e: InputEvent) => {
            this.state.value(e.currentTarget!.value);

            this.state.timeoutKey && clearTimeout(this.state.timeoutKey);
            this.state.timeoutKey = setTimeout(() => {
              this.state.searchQuery(e.target!.value);
              
			  
            }, DEBOUNCE_TIME);
          }}
        />

        <Separator />
		<span>{
		
		
		}</span>
		
        {content}
		
      </Dropdown>
		);
	}






	protected minSearchLength(): number {
		//const val = app.forum.attribute < number > ( 'TohsakaratTagsFilter.minSearchLength' );

		return 0;
	}

	protected maxResults(): number {
		//const val = app.forum.attribute < number > ( 'TohsakaratTagsFilter.resultCount' );

		return 5;
	}


	//搜索
	async performSearch(query: string): Promise < void > {
	
		//console.log(this)
		if (this.state.lastSearchedQuery === query) return;

		if (this.state.searchQuery()
			.length < this.minSearchLength()) {
			this.state.currentData = [];
			return;
		}

		this.state.loading = true;
		this.state.lastSearchedQuery = query;
		var data = []

		//console.log('thisTagsFilter')
		//console.log(this)
		app.store.find('tags')
		.then((v) => {
		
			this.state.tagList = v.map(d => d.data).sort((a,b)=>{return a.attributes.discussionCount - b.attributes.discussionCount});
			this.refreshTagView()
			this.state.tagListr = this.state.tagView.map((d) => {
			
				let z = JSON.parse(JSON.stringify(d));
				z.attributes = JSON.stringify(z.attributes);
				return z;
			})
			
			data = this.state.tagListr.filter((d) => {
				return d.attributes.toLowerCase().indexOf(query.toLowerCase()) != -1
			})

			data = data.map((w) => {
				w.attributes = this.state.tagList.filter((l) => {
					return l.id == w.id
				})[0].attributes
				return w;
			})
			//console.log('data')
			//console.log(data)
			this.state.currentData = JSON.parse(JSON.stringify(data));
			
			this.state.loading = false;
			m.redraw();
		});



		// Prevent race conditions where a new search will finish before an old search
		if (this.state.searchQuery() !== query) return;



		this.state.loading = false;
		m.redraw();
	}



	//更新tag
	UpdateSelectedTags(){
			if(this.state.tagList.length){
			
			
			const params = app.search.params();
			this.state.selectedTags= params.q ? params.q.split(' ').filter((d) => {return d.indexOf('tag:') != -1}).map((d) => {return d.replaceAll('tag:', '')}) : [];

			this.state.selectedTags=this.state.selectedTags.map(
			(d)=>{
			return this.state.tagList.filter((a)=>{return a.attributes.slug==d})[0]
			}
			
			)
			this.state.selectedTagsStr = this.state.selectedTags.map(i=>i.attributes.name).join(' ')
			//this.label=this.state.selectedTagsStr;
			m.redraw();
			
			
			//console.log('UpdateSelectedTags()')
			//console.log( this.state.selectedTagsStr)
			return this.state.selectedTagsStr;
			}else return '';
	
	}

	//增选tag
	handleTagsChange(tag: string | null) {
		const params = app.search.params();
		const old = params.q;
		if (!tag) {
			params.q = params.q;
		} else {
			params.q = params.q ? params.q.split(' ') : [];
			params.q = params.q.indexOf('tag:' + tag) == -1 ? params.q.join(' ') + ' tag:' + tag : params.q.join(' ');
			if(params.q[0]==' ')params.q=params.q.substr(1)
			if(params.q[params.q.length-1]==' ')params.q=params.q.substr(0,params.q.length-2)
			
		}

		if (old !== params.q) {
			m.route.set(app.route(app.current.get('routeName'), {
				...m.route.param(),
				...params
			}));
		}
		this.UpdateSelectedTags()

		m.redraw();


	}
	//删除tag
	removeTag(tagSlug: string | null) {
		const params = app.search.params();
		const old = params.q;
		if (!tagSlug) {
			params.q = params.q;
		} else {
			params.q = params.q.split(' ').filter((e)=>{return (e!=('tag:'+tagSlug))&&(e!='')}).join(' ')
			if(params.q[0]==' ')params.q=params.q.substr(1)
			if(params.q[params.q.length-1]==' ')params.q=params.q.substr(0,params.q.length-1)
		}

		if (old !== params.q) {
			m.route.set(app.route(app.current.get('routeName'), {
				...m.route.param(),
				...params
			}));
		}
		this.UpdateSelectedTags()

		m.redraw();


	}




get label() {
    function wrapLabel(text: Mithril.Children) {
      return app.translator.trans('tohsakarat-tags-filter.forum.index_page.filter_tags.label', { text: <b>{text}</b> });
    }

    if (app.search.params().q) {
	 var str=this.UpdateSelectedTags()
      if (!str) {
        this.handleTagsChange(null);
      } else {
        return wrapLabel(str);
      }
    }

    return wrapLabel(app.translator.trans('tohsakarat-tags-filter.forum.index_page.filter_tags.all'));
  }


}
