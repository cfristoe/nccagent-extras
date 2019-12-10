let tableSelector = ( '' != wpvars.table_class )? '.' + wpvars.table_class : '#' + wpvars.table_id ;
let init = 0;
const dtSelects = [];
let appendedValues = [];

(function($){


  // START DT Options
  const dtOptions = {
    lengthMenu: [10,20,40,100],
    columnDefs: [
      {orderable: false, targets: [0,1,2,3,4]},
      {
        createdCell: function(td, cellData, rowData, row, col){
        var html = $.parseHTML(cellData);
        $(td).html(html[0]);
        },
        targets: [1]
      },
      {visible: false, targets: [1,2,3]}
    ],
    language: {
      'zeroRecords': 'Select one or more options to find plans.'
    },
    pageLength: 50,
    initComplete: function () {
      var thisTable = this;
      const totalColumns = 5;

      this.api().columns().every( function (colIdx) {
        var column = this;
        console.log('🔔 Setting up Column ' + colIdx);
        if( 0 === colIdx )
          return;

        // Add all dtSelects to the last column
        if( colIdx === (totalColumns - 1) ){
          for( var i = 0; i < dtSelects.length; i++ ){
            console.log(`dtSelects[${i}]`, dtSelects[i]);
            if( typeof dtSelects[i] !== 'undefined' )
              dtSelects[i].appendTo( $(column.header()) );
          }
          return;
        }

        if( colIdx === (totalColumns - 2) ){
          var select = $('<select class="dt-select" data-colId="3"><option class="first-option" value="">Select a State...</option><option value="AL">Alabama</option><option value="AK">Alaska</option><option value="AZ">Arizona</option><option value="AR">Arkansas</option><option value="CA">California</option><option value="CO">Colorado</option><option value="CT">Connecticut</option><option value="DE">Delaware</option><option value="DC">District Of Columbia</option><option value="FL">Florida</option><option value="GA">Georgia</option><option value="HI">Hawaii</option><option value="ID">Idaho</option><option value="IL">Illinois</option><option value="IN">Indiana</option><option value="IA">Iowa</option><option value="KS">Kansas</option><option value="KY">Kentucky</option><option value="LA">Louisiana</option><option value="ME">Maine</option><option value="MD">Maryland</option><option value="MA">Massachusetts</option><option value="MI">Michigan</option><option value="MN">Minnesota</option><option value="MS">Mississippi</option><option value="MO">Missouri</option><option value="MT">Montana</option><option value="NE">Nebraska</option><option value="NV">Nevada</option><option value="NH">New Hampshire</option><option value="NJ">New Jersey</option><option value="NM">New Mexico</option><option value="NY">New York</option><option value="NC">North Carolina</option><option value="ND">North Dakota</option><option value="OH">Ohio</option><option value="OK">Oklahoma</option><option value="OR">Oregon</option><option value="PA">Pennsylvania</option><option value="RI">Rhode Island</option><option value="SC">South Carolina</option><option value="SD">South Dakota</option><option value="TN">Tennessee</option><option value="TX">Texas</option><option value="UT">Utah</option><option value="VT">Vermont</option><option value="VA">Virginia</option><option value="WA">Washington</option><option value="WV">West Virginia</option><option value="WI">Wisconsin</option><option value="WY">Wyoming</option></select>')
            /*.appendTo( $(column.header()) )*/
            .on( 'change', function () {
              // Reset the table when all <select/> values are empty
              var filtered = isTableFiltered();
              if( ! filtered )
                resetCarriersProductsTable();

              // Run the search...
              var parentTableId = $(thisTable).attr('id');
              var parentDataTable = $( '#' + parentTableId ).dataTable().api();
              var parentSearch = parentDataTable.search();
              if( 'InitialSearchValueToZeroOutResults' == parentSearch && '' != $(this).val() ){
                parentDataTable.search('');
              }

              parentDataTable
                .column(colIdx)
                .search($(this).val())
                .draw();
            });

            dtSelects[colIdx] = select;
        } else if( 0 < colIdx ){
          var firstOption = ( 1 === colIdx )? 'Select a Carrier...' : 'Select a Product...' ;
          var select = $(`<select class="dt-select" data-colId="${colIdx}"><option class="first-option" value="">${firstOption}</option></select>`)
          /*.appendTo( $(column.header()) )*/
          .on( 'change', function () {
            // Reset the table when all <select/> values are empty
            var filtered = isTableFiltered();
            if( ! filtered )
              resetCarriersProductsTable();

            // Reset table.search when we start searching
            var parentTableId = $(thisTable).attr('id');
            var parentDataTable = $( '#' + parentTableId ).dataTable().api();
            var parentSearch = parentDataTable.search();
            if( 'InitialSearchValueToZeroOutResults' == parentSearch && '' != $(this).val() ){
              parentDataTable.search('');
            }

            // Run the search...
            parentDataTable
              .column(colIdx)
              .search($(this).val())
              .draw();
          });

          // Add the unique options to the <select>
          column.data().unique().sort().each( function ( data, index ) {
            if( 2 === colIdx ){
              var value = stripTags(data);
              select.append(`<option value="${value}">${value}</option>`);
            } else if( 1 === colIdx ) {
              var html = $.parseHTML(data);
              var value = html[2].innerHTML;
              if( 0 > appendedValues.indexOf(value) && '' != value ){
                select.append(`<option value="${value}">${value}</option>`);
                appendedValues.push(value);
              }
            }

            /**
             * Re-sort the Products drop down with Medicare at the top:
             */
            if( ( index + 1 ) === this.length && 1 === colIdx ){
              var options = select[0].options;
              var medicareArray = [];

              // Add any `Medicare` options to our tmp `medicareArray`
              for( var i = 0; i < options.length; i++ ){
                var text = options[i].text;
                var value = options[i].value;
                if( -1 != text.indexOf('Medicare') )
                  medicareArray.push({text: text, value: value, index: i});
              }

              // Insert `Medicare` options at the top of `options`
              if( 0 < medicareArray.length ){
                // Remove original `Medicare` options
                for( var i = medicareArray.length - 1; i >= 0; i-- ){
                  options.remove( medicareArray[i]['index'] );
                }
                // Add `Medicare` options before option[1]
                for( var i = medicareArray.length - 1; i >= 0; i-- ){
                  var op = new Option(medicareArray[i]['text'], medicareArray[i]['value']);
                  options.add(op,1);
                  // Add a `divider`
                  /*
                  if( i === 0 ){
                    var op = new Option('------------','');
                    op.disabled = true;
                    options.add(op,medicareArray.length + 1);
                  }
                  */
                }
              } // if( 0 < medicareArray.length )

            } // Re-sort the Products drop down with Medicare at the top:

          });

          dtSelects[colIdx] = select;
        }
      });



      /**
       * Add Select2 to each <select/>
       */
      $('.dt-select').each(function(index){
        var firstOption = $(this).find('.first-option').html();
        $(this).select2({
          allowClear: true,
          placeholder: firstOption
        });
      });
    }
  }
  // END DT Options
  var table = $( tableSelector ).DataTable(dtOptions)
  table.search('InitialSearchValueToZeroOutResults').draw();
  var data = table.data();

  /**
   * Update the text for zeroResults after user makes filter selections.
   */
  table.on('draw.dt', function(){
    var empty = $('#datatable').find('.dataTables_empty');
    if( empty ){
      var filtered = isTableFiltered();
      var message = ( filtered )? 'Your search did not return any results. Please try again.' : 'Select one or more options to find plans.' ;
      empty.html(message);
    }
  });

  /**
   * Resets our Carriers and Products table
   */
  function resetCarriersProductsTable(){
    console.log('🚨 RESETTING Carriers & Products table:');

    // Remove Select2 from dropdowns
    console.log(`👉 Removing Select2 from dropdowns.`);
    $('.dt-select').select2('destroy');

    console.log(`👉 Removing each drop down.`);
    $('.dt-select').each(function(i){
      $(this).remove();
    });

    // Grab table rows/data
    console.log(`👉 Add the table data to our dtOptions.`);
    dtOptions.data = data;
    dtOptions.search = {search: 'InitialSearchValueToZeroOutResults'};

    // Clear the table
    console.log(`👉 Clearing and Destroying the DataTable.`);
    table.clear().destroy();

    // Clear appendedValues
    console.log(`👉 Clearing appendedValues.`);
    appendedValues = [];

    // Re-initialize the table
    console.log(`👉 Rebuilding the table.`);
    table = $( tableSelector ).DataTable(dtOptions);
  }

  /**
   * Checks our drop down options to see if the table is filtered.
   *
   * @return     {boolean}  True if table filtered, False otherwise.
   */
  function isTableFiltered(){
    var allSelectValues = '';
    $('.dt-select').each(function(i){
      allSelectValues+= $(this).val();
    });
    var filtered = ( '' == allSelectValues || null == allSelectValues )? false : true;
    console.log(`❓isTableFiltered() filtered = ${filtered}`);
    return filtered;
  }
})(jQuery);

/**
 * Strips HTML tags from supplied HTML
 *
 * @param      {string}  html    The html
 * @return     {string}  Striped text
 */
function stripTags( html ){
  var div = document.createElement('div');
  div.innerHTML = html;
  var text = div.textContent || div.innerText || '';
  return text;
}