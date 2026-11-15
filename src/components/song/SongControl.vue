<template>
  <div class="q-pa-md">
    <q-input v-model="control.background" clearable :rules="['anyColor']" label="Beamer achtergrond kleur (Leeg voor foto)" class="q-mb-sm">
      <template #append>
        <q-icon name="colorize" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-color v-model="control.background" />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <BackgroundSetting v-model:bgFileId="settings.bgFileId" v-model:bgOpacity="settings.bgOpacity" />
  </div>
  <q-separator size="5px" color="primary"/>
  <div class="q-pa-md">
    <div class="row">
      <q-select
        standout="bg-teal text-white"
        v-model="control.fontFamily"
        :options="fontFamilys"
        label="font-family"
      />
      <q-select
        standout="bg-teal text-white"
        v-model="control.paintOrder"
        :options="paintOrders"
        label="paintOrder (normal = rand voor fill, stroke = rand achter fill)"
      />
    </div>
    <q-item>
      <q-item-section>{{`letterSpacing: ${control.letterSpacing}vw / ${(control.letterSpacing*19.2).toFixed(2)}px`}}</q-item-section>
      <q-item-section>
        <q-slider
          v-model="control.letterSpacing"
          :min="0"
          :max="0.5"
          :step="0.005"
          markers
          :marker-labels="[{ value: 0.01, label: '0.01vw' }]"
          dense
        />
      </q-item-section>
    </q-item>

    <q-separator size="5px" color="primary"/>
    
    <q-item><q-item-section>Song Lettertype</q-item-section></q-item>
    <div class="row">
      <q-select
        standout="bg-teal text-white"
        v-model="control.fontStyle"
        :options="fontStyles"
        label="font-style"
      />
      <q-input v-model="control.fill" :rules="['anyColor']" label="Opvul kleur (fill)" class="q-mb-sm">
        <template #append>
          <q-icon name="colorize" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-color v-model="control.fill" />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <q-input v-model="control.stroke" :rules="['anyColor']" label="Rand kleur (stroke)" class="q-mb-sm">
        <template #append>
          <q-icon name="colorize" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-color v-model="control.stroke" />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
    <q-item>
      <q-item-section>{{`font-weight: ${control.fontWeight}`}}</q-item-section>
      <q-item-section>
        <q-slider
          v-model="control.fontWeight"
          :min="300"
          :max="900"
          :step="100"
          markers
          :marker-labels="[{ value: 400, label: '400' }]"
          dense
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>{{`Regel hoogte: ${control.lineHeigth}vw / ${(control.lineHeigth*19.2).toFixed(1)}px`}}</q-item-section>
      <q-item-section>
        <q-slider
          v-model="control.lineHeigth"
          :min="0.1"
          :max="10"
          :step="0.05"
          markers
          :marker-labels="[{ value: 4.4, label: '4.4vw' }]"
          dense
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>{{`font-size: ${control.fontSize}vw / ${(control.fontSize*19.2).toFixed(1)}px`}}</q-item-section>
      <q-item-section>
        <q-slider
          v-model="control.fontSize"
          :min="0.1"
          :max="10"
          :step="0.05"
          markers
          :marker-labels="[{ value: 3.8, label: '3.8vw' }]"
          dense
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>{{`stroke-width: ${control.strokeWidth}vw effectief ${(control.strokeWidth*19.2*strokefactor).toFixed(1)}px`}}</q-item-section>
      <q-item-section>
        <q-slider
          v-model="control.strokeWidth"
          :min="0"
          :max="3"
          :step="0.05"
          markers
          :marker-labels="[{ value: 0.5, label: '0.5vw' }]"
          dense
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>{{`Schaduw ratio: ${control.filter}`}}</q-item-section>
      <q-item-section>
        <q-slider
          v-model="control.filter"
          :min="0"
          :max="1"
          :step="0.05"
          markers
          :marker-labels="[{ value: 0.8, label: '0.8' }]"
          dense
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>{{`Schaduw lengte: ${control.filterlength}vw / ${(control.filterlength*19.2).toFixed(1)}px`}}</q-item-section>
      <q-item-section>
        <q-slider
          v-model="control.filterlength"
          :min="0"
          :max="5"
          :step="0.05"
          markers
          :marker-labels="[{ value: 0.3, label: '0.3vw' }]"
          dense
        />
      </q-item-section>
    </q-item>
    <q-separator size="5px" color="primary"/>
    
    <q-item><q-item-section>Vertaling Lettertype</q-item-section></q-item>
    <div class="row">
      <q-select
        standout="bg-teal text-white"
        v-model="control.translationFontStyle"
        :options="fontStyles"
        label="font-style"
      />
      <q-input v-model="control.translationFill" :rules="['anyColor']" label="Opvul kleur (fill)" class="q-mb-sm">
        <template #append>
          <q-icon name="colorize" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-color v-model="control.fill" />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
    <q-item>
      <q-item-section>{{`font-weight: ${control.translationFontWeight}`}}</q-item-section>
      <q-item-section>
        <q-slider
          v-model="control.translationFontWeight"
          :min="300"
          :max="900"
          :step="100"
          markers
          :marker-labels="[{ value: 400, label: '400' }]"
          dense
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>{{`Regel hoogte: ${control.translationLineHeigth}vw / ${(control.translationLineHeigth*19.2).toFixed(1)}px`}}</q-item-section>
      <q-item-section>
        <q-slider
          v-model="control.translationLineHeigth"
          :min="0.1"
          :max="10"
          :step="0.05"
          markers
          :marker-labels="[{ value: 4.4, label: '4.4vw' }]"
          dense
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>{{`font-size: ${control.translationFontSize}vw / ${(control.translationFontSize*19.2).toFixed(1)}px`}}</q-item-section>
      <q-item-section>
        <q-slider
          v-model="control.translationFontSize"
          :min="0.1"
          :max="10"
          :step="0.05"
          markers
          :marker-labels="[{ value: 3.4, label: '3.4vw' }]"
          dense
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>{{`stroke-width: ${control.translationStrokeWidth}vw effectief: ${(control.translationStrokeWidth*19.2*strokefactor).toFixed(1)}px`}}</q-item-section>
      <q-item-section>
        <q-slider
          v-model="control.translationStrokeWidth"
          :min="0"
          :max="3"
          :step="0.05"
          markers
          :marker-labels="[{ value: 0.4, label: '0.4vw' }]"
          dense
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>{{`Schaduw ratio: ${control.translationFilter}`}}</q-item-section>
      <q-item-section>
        <q-slider
          v-model="control.translationFilter"
          :min="0"
          :max="1"
          :step="0.05"
          markers
          :marker-labels="[{ value: 0.6, label: '0.6' }]"
          dense
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>{{`Schaduw lengte: ${control.translationFilterlength}vw / ${(control.translationFilterlength*19.2).toFixed(1)}px`}}</q-item-section>
      <q-item-section>
        <q-slider
          v-model="control.translationFilterlength"
          :min="0"
          :max="5"
          :step="0.05"
          markers
          :marker-labels="[{ value: 0.3, label: '0.3vw' }]"
          dense
        />
      </q-item-section>
    </q-item>
  </div>

  <q-separator size="5px" color="primary"/>
  <TextSlidesControl v-if="presentation.settings.text" :presentation="presentation" :preview="preview" />
  <div
    v-else
    v-shortkey="shortkeysNextBack"
    @shortkey="baseHandleArrow"
    @click="setHandleArrowLocation"
  />

</template>

<script>
import { defineComponent } from 'vue'
import BaseControl from '../presentation/BaseControl.vue'
import TextSlidesControl from '../common/TextSlidesControl.vue'
import BackgroundSetting from '../presentation/BackgroundSetting.vue'

export default defineComponent({
  name: 'SongControl',
  components: { BackgroundSetting, TextSlidesControl },
  extends: BaseControl,
  data () {
    return {
      fontFamilys: ['\'Alan Sans\', sans-serif', '\'Ubuntu\', sans-serif'],
      fontStyles: ['normal', 'italic'],
      paintOrders: ['normal','stroke'],
      tab: 'songtextcontrol'
    }
  },
  created () {
    // create .control via store: preview/golive
  },
  computed: {
    control () {
      return this.presentation.control
    },
    strokefactor () {
        return this.control.paintOrder == 'stroke' ? 0.5 : 1
    }
  }
})

</script>
