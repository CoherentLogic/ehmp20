require_relative 'parent_applet.rb'

class PobAllergiesApplet < PobParentApplet 
  
  set_url '#/patient/allergy-grid-full'
  set_url_matcher(/#\/patient\/allergy-grid-full/)
  
  # *****************  All_Form_Elements  ******************* #
  # *****************  All_Logo_Elements  ******************* #
  # *****************  All_Field_Elements  ******************* #  
    
  element :fld_allergen_name, "th[id='allergy_grid-summary'] a"
  element :fld_modal_title, "[id^='main-workflow-label-']"
  element :fld_allergen_drop_down, "[x-is-labelledby='select2-allergen-container']"
  element :fld_allergen_search, ".select2-search__field"
  element :fld_allergen_select, "li:contains('CHOCOLATE LAXATIVE')"
  element :fld_historical_check_box, "#allergyType-h"
  element :fld_observed_check_box, "#allergyType-o"
  element :fld_reaction_date_input, "#reaction-date"
  element :fld_reaction_time_input, "#reaction-time"
  element :fld_severity_drop_down, "#severity"
  element :fld_nature_of_reaction_drop_down, "#nature-of-reaction"
  element :fld_available_signs_input, "#available-Signs-Symptoms-modifiers-filter-results"
  element :fld_add_anxiety_sign_symptom, "[title='Press enter to add ANXIETY.']"
  element :fld_comments_input, "#moreInfo"

    
  elements :fld_modal_titles, ".modal-body .row"
  elements :fld_modal_table_rows, ".modal-body .table-row"
  elements :fld_allergy_gist_pills, "[data-appletid=allergy_grid] .grid-container [data-infobutton-class=info-button-pill]"

  elements :expanded_rows, "[data-appletid='allergy_grid'] table tbody tr.selectable"
  elements :expanded_allegy_names, "[data-appletid='allergy_grid'] table tbody tr.selectable td:first-of-type"
  elements :expanded_allegy_names_screenreader_text, "[data-appletid='allergy_grid'] table tbody tr.selectable td:first-of-type span"

  # *****************  All_Button_Elements  ******************* #
  element :btn_add_allergy, "[data-appletid=allergy_grid] .applet-add-button"
  element :btn_add_allergy_cancel, "#form-cancel-btn"
  element :btn_confirm_add_allergy, "div.addBtn  [type='submit']"
  element :btn_next, '#allergyGridNext'
  element :btn_previous, '#allergyGridPrevious'
  
  # *****************  All_Drop_down_Elements  ******************* #
  
  # *****************  All_Table_Elements  ******************* #

  def allergy_pill(data_infobutton)
    self.class.element(:fld_allergy_pill, "[data-infobutton='#{data_infobutton}']")
  end

  def first_pill_text
    # assumption, there is at least 1 pill displayed
    title = fld_allergy_gist_pills[0].text
    # only pull screenreader text for first pill
    self.class.elements :fld_first_pill_screenreader_text, :xpath, "//*[@data-appletid='allergy_grid']/descendant::*[@data-infobutton-class='info-button-pill'][1]/descendant::span[contains(@class, 'sr-only')]"
    fld_first_pill_screenreader_text.each do | span |
      # remove screen reader text from title
      title = title.sub(span.text, '')
    end
    # remove leading/trailing white space
    title.strip
  end

  elements :tbl_allergy_grid, "table[id='data-grid-allergy_grid'] tr.selectable"
    
  def initialize
    super
    appletid_css = "[data-appletid=allergy_grid]"
    add_applet_buttons appletid_css
    add_title appletid_css
    add_empty_table_row appletid_css
    add_generic_error_message appletid_css
    add_empty_gist appletid_css
    add_toolbar_buttons
  end
  
  def applet_loaded?
    return true if has_fld_empty_row?
    return tbl_allergy_grid.length > 0
  rescue => exc
    p exc
    return false
  end
  
  def applet_gist_loaded?
    return true if has_fld_empty_gist?
    return fld_allergy_gist_pills.length > 0
  rescue => exc
    p exc
    return false
  end

  def wait_until_applet_loaded
    wait_until { applet_loaded? }
  end
  
  def wait_until_applet_gist_loaded
    wait_until { applet_gist_loaded? }
  end

  def expanded_allergy_names
    names_screenreader_text = expanded_allegy_names
    screenreader_text = expanded_allegy_names_screenreader_text
    names_only = []
    names_screenreader_text.each_with_index do | td_element, index |
      name = td_element.text
      name = name.sub(screenreader_text[index].text, '')
      names_only.push(name.strip)
    end
    names_only
  end
end
