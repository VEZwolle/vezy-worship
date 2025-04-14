<template>
  <component ref='SortableListRef' :is='tag' :class="sortableClass" >
    <slot name='header'></slot> 
    <slot
      v-for='(item, index) of list'
      :key='getKey(item)'
      :element='item'
      :index='index'
      name='item'
    ></slot>
    <slot name='footer'></slot>
  </component>
</template>

<script>
// idee van: https://github.com/MaxLeiter/sortablejs-vue3
import { defineComponent } from 'vue'
import Sortable, { MultiDrag, /* Swap, AutoScroll, Spill*/} from 'sortablejs'
Sortable.mount(new MultiDrag(), /* new Swap(), new AutoScroll(),new Spill()*/)

export default defineComponent({
  name: 'SortableList',
  props: {
    /** list of items **/
    modelValue: { // list
      type: [Array, Object],
      default: null, // []
      required: true
    },
    /** The name of the key present in each item in the list that corresponds to a unique value. */
    itemKey: {
      type: [String, Function],
      default: '',
      required: true
    },
    /** The element type to render as. */
    tag: {
      type: String,
      default: 'div',
      required: false
    },
    sortableClass: {
      type: String,
      default: '',
      required: false
    },
    /** All SortableJS options:
      //default options
        group: "name",  // or { name: "...", pull: [true, false, 'clone', array], put: [true, false, array] }
        sort: true,  // sorting inside list
        delay: 0, // time in milliseconds to define when the sorting should start
        delayOnTouchOnly: false, // only delay if user is using touch
        touchStartThreshold: 0, // px, how many pixels the point should move before cancelling a delayed drag event
        disabled: false, // Disables the sortable if set to true.
        store: null,  // get/set
        animation: 150,  // ms, animation speed moving items when sorting, `0` — without animation
        easing: "cubic-bezier(1, 0, 0, 1)", // Easing for animation. Defaults to null. See https://easings.net/ for examples.
        handle: ".my-handle",  // Drag handle selector within list items
        filter: ".ignore-elements",  // Selectors that do not lead to dragging (String or Function)
        preventOnFilter: true, // Call `event.preventDefault()` when triggered `filter`
        draggable: ".item",  // Specifies which items inside the element should be draggable
        dataIdAttr: 'data-id', // HTML attribute that is used by the `toArray()` method
        ghostClass: "sortable-ghost",  // Class name for the drop placeholder
        chosenClass: "sortable-chosen",  // Class name for the chosen item
        dragClass: "sortable-drag",  // Class name for the dragging item
        swapThreshold: 1, // Threshold of the swap zone
        invertSwap: false, // Will always use inverted swap zone if set to true
        invertedSwapThreshold: 1, // Threshold of the inverted swap zone (will be set to swapThreshold value by default)
        direction: 'horizontal', // Direction of Sortable (will be detected automatically if not given)
        forceFallback: false,  // ignore the HTML5 DnD behaviour and force the fallback to kick in
        fallbackClass: "sortable-fallback",  // Class name for the cloned DOM Element when using forceFallback
        fallbackOnBody: false,  // Appends the cloned DOM Element into the Document's Body
        fallbackTolerance: 0, // Specify in pixels how far the mouse should move before it's considered as a drag.
        dragoverBubble: false,
        removeCloneOnHide: true, // Remove the clone element when it is not showing, rather than just hiding it
        emptyInsertThreshold: 5, // px, distance mouse must be from empty sortable to insert drag element into it
      // MultiDrag Options
        multiDrag: true, // Enable the plugin
        selectedClass: "sortable-selected", // Class name for selected item
        multiDragKey: null, // Key that must be down for items to be selected vb: 'CTRL'
        avoidImplicitDeselect: false, // true - if you don't want to deselect items on outside click
      // Swap Options ('not used --> import/mount above')
        swap: true, // Enable swap mode
        swapClass: "sortable-swap-highlight", // Class name for swap item (if swap mode is enabled)
      // AutoScroll Options ('not used --> import/mount above')
        scroll: true, // Enable the plugin. Can be HTMLElement.
        forceAutoScrollFallback: false, // force autoscroll plugin to enable even when native browser autoscroll is available
        scrollSensitivity: 30, // px, how near the mouse must be to an edge to start scrolling.
        scrollSpeed: 10, // px, speed of the scrolling
        bubbleScroll: true, // apply autoscroll to all parent elements, allowing for easier movement
      // Spill Options ('not used --> import/mount above')
        revertOnSpill: true, // Enable RevertOnSpill Plugin | This plugin, when enabled, will cause the dragged item to be reverted to it's original position if it is spilled (ie. it is dropped outside of a valid Sortable drop target)
        removeOnSpill: true, // Enable RemoveOnSpill Plugin | This plugin, when enabled, will cause the dragged item to be removed from the DOM if it is spilled (ie. it is dropped outside of a valid Sortable drop target)
     */
    options: {
      type: Object,
      default: null,
      required: false
    }
  },
  emits: [
    'update:modelValue'
  ],
  data () {
    return {
      list: this.modelValue,
      isDragging: false,
      // containerRef: null,
      sortable: null
    }
  },
  watch: {
    'modelValue' () {
      // nog toevoegen allene toepassen wanneer gewijzigd door extern oid?
      if (!this.isDragging) this.list = this.modelValue
    },
    'options' (options) {
      if (options && this.sortable) {
        for (const property in options) {
          this.sortable.option(property, options[property])
        }
      }
    }
  },
  created () {
    console.log('SortableList Created')
  },
  mounted () {
    this.initializeSortable()
    console.log('SortableList mounted')
  },
  beforeUnmount () {
    if (this.sortable) {
      this.sortable.destroy()
      this.$refs.SortableListRef = null
      this.sortable = null
    }
  },
  computed: {
    getKey () {
      if (typeof this.itemKey === 'string') {
        return (item) => item[this.itemKey]
      }
      return this.itemKey
    }
  },
  methods: {
    initializeSortable () {
      if (this.$refs.SortableListRef) {
        this.sortable = new Sortable(this.$refs.SortableListRef, {
          ...this.options,
          /** Default events */
          onChoose: (e) => this.onChoose(e), // Element is chosen
          onUnchoose: (e) => this.onUnChoose(e), // Element is unchosen
	        onStart: (e) => { // Element dragging started
            this.isDragging = true
            this.onStart(e)
          },
          onEnd: (e) => { // Element dragging ended
            setTimeout(() => { // move tot end of the queue, conform this issue: https://github.com/SortableJS/Sortable/issues/1184
              this.isDragging = false
              this.onEnd(e)
            })
          },
          onAdd: (e) => this.onAdd(e), // Element is dropped into the list from another list
          onUpdate: (e) => this.onUpdate(e), // Changed sorting within list
          onSort: (e) => this.onSort(e), // Called by any change to the list (add / update / remove)
          onRemove: (e) => this.onRemove(e), // Element is removed from the list into another list
          onFilter: (e) => this.onFilter(e), // Attempt to drag a filtered element
          onMove: (e) => this.onMove(e), // Event when you move an item in the list or between lists
          onClone: (e) => this.onClone(e), // Called when creating a clone of element
          onChange: (e) => this.onChange(e), // Called when dragging element changes position
          /** MultiDrag events */
          onSelect: (e) => this.onSelect(e), // Called when an item is selected
          onDeselect: (e) => this.onDeselect(e) // Called when an item is deselected
          /** Spill events ('not used --> import/mount above') */
          // onSpill: (e) => this.onSpill(e) // Called when item is spilled
        })
      } else {
        console.error('initializeSortable HTML-element not found', this.$refs.SortableListRef)
      }
    },
    // default events
    onChoose (event) { // Element is chosen
      console.log('onChoose', event)
    },
    onUnChoose (event) { // Element is unchosen
      console.log('onUnChoose', event)
    },
    onStart (event) { // Element dragging started
      console.log('onStart', event)
    },
    onEnd (event) { // Element dragging ended
      console.log('onEnd', event)
    },
    onAdd (event) { // Element is dropped into the list from another list
      console.log('onAdd', event)
    },
    onUpdate (event) { // Changed sorting within list
      console.log('onUpdate', event)
    },
    onSort (event) { // Called by any change to the list (add / update / remove)
      console.log('onSort', event)
    },
    onRemove (event) { // Element is removed from the list into another list
      console.log('onRemove', event)
    },
    onFilter (event) { // Attempt to drag a filtered element
      console.log('onFilter', event)
    },
    onMove (event) { // Event when you move an item in the list or between lists
      console.log('onMove', event)
    },
    onClone (event) { // Called when creating a clone of element
      console.log('onClone', event)
    },
    onChange (event) { // Called when dragging element changes position
      console.log('onChange', event)      
    },
    // MultiDrag
    onSelect (event) { // Called when an item is selected
      console.log('onSelect', event)      
    },
    onDeselect (event) { // Called when an item is deselected
      console.log('onDeselect', event)      
    },
    // Spill
    onSpill (event) { // Called when an item is selected
      console.log('onSpill', event)      
    },

    // Utils
    updateModelValue () {
      this.$emit('update:modelValue', this.list)
    },

    moveItemInList (from, to) {
      console.log('start', this.list)
      const item = this.list.splice(from, 1)[0]
      this.list.splice(to, 0, item)
      console.log('end', this.list)
    },
    SortableUpdate (event) {
      console.log('Sortable onUpdate', event)
      if (!event.oldDraggableIndex || !event.newDraggableIndex) return
      this.moveItemInList(event.oldDraggableIndex, event.newDraggableIndex)
    }

  }
})
</script>
