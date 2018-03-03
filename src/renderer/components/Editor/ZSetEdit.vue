<template>
  <div class="BaseContent" style="display: flex;">
    <div class="Editor" style="flex: 1 1 0%; display: flex; flex-direction: column;">
      <div class="ReactCodeMirror">
        <textarea autocomplete="off" style="display: none;">string val</textarea>
        <div class="CodeMirror cm-s-default CodeMirror-wrap">
          <div style="overflow: hidden; position: relative; width: 3px; height: 0px; top: 4px; left: 50px;">
            <textarea autocorrect="off" autocapitalize="off" spellcheck="false" style="position: absolute; bottom: -1em; padding: 0px; width: 1000px; height: 1em; outline: none;" tabindex="0"></textarea>
          </div>
          <div class="CodeMirror-vscrollbar" cm-not-content="true" style="width: 18px; pointer-events: none;">
            <div style="min-width: 1px; height: 0px;"></div>
          </div>
          <div class="CodeMirror-hscrollbar" cm-not-content="true" style="height: 18px; pointer-events: none;">
            <div style="height: 100%; min-height: 1px; width: 0px;"></div>
          </div
          ><div class="CodeMirror-scrollbar-filler" cm-not-content="true"></div>
          <div class="CodeMirror-gutter-filler" cm-not-content="true"></div>
          <div class="CodeMirror-scroll" tabindex="-1">
            <div class="CodeMirror-sizer" style="margin-left: 46px; margin-bottom: 0px; border-right-width: 30px; min-height: 28px; padding-right: 0px; padding-bottom: 0px;">
            <div style="position: relative; top: 0px;">
              <div class="CodeMirror-lines" role="presentation"><div role="presentation" style="position: relative; outline: none;"><div class="CodeMirror-measure"><div class="CodeMirror-linenumber CodeMirror-gutter-elt"><div>1</div></div></div><div class="CodeMirror-measure"></div><div style="position: relative; z-index: 1;"></div><div class="CodeMirror-cursors"><div class="CodeMirror-cursor" style="left: 4px; top: 0px; height: 20px;">&nbsp;</div></div><div class="CodeMirror-code" role="presentation"><div class="CodeMirror-activeline" style="position: relative;"><div class="CodeMirror-activeline-background CodeMirror-linebackground"></div><div class="CodeMirror-gutter-background CodeMirror-activeline-gutter" style="left: -46px; width: 46px;"></div><div class="CodeMirror-gutter-wrapper CodeMirror-activeline-gutter" style="left: -46px;"><div class="CodeMirror-linenumber CodeMirror-gutter-elt" style="left: 16px; width: 21px;">1</div></div><pre class=" CodeMirror-line " role="presentation"><span role="presentation" style="padding-right: 0.1px;">string val</span></pre></div></div></div></div></div></div><div style="position: absolute; height: 30px; width: 1px; border-bottom: 0px solid transparent; top: 28px;"></div><div class="CodeMirror-gutters" style="height: 58px; left: 0px;"><div class="CodeMirror-gutter CodeMirror-lint-markers"></div><div class="CodeMirror-gutter CodeMirror-linenumbers" style="width: 29px;"></div></div></div></div></div><div class="operation-pannel"><label class="wrap-selector"><input type="checkbox" value="on"><span>Wrapping</span></label><select class="mode-selector"><option value="raw">Raw</option><option value="json" disabled="">JSON</option><option value="messagepack" disabled="">MessagePack</option></select><button class="nt-button" disabled="">Save Changes</button></div></div></div>
</template>

<script>
  export default {
    data () {
      return {
       
      }
    }
  }
</script>

<style scoped>
  
</style>
