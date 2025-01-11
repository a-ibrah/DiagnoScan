document.addEventListener("DOMContentLoaded", () => {
    
      if (document.getElementById("slides-table")) {
        $(document).ready(function () {
            // Initialize DataTable for Queued Slides
            const queuedTable = $('#slides-table').DataTable({
                serverSide: true,
                order: [[2, "desc"]], 
                ajax: {
                    url: '/data',
                    data: function (d) {
                        d.filterStatus = 'pending'; 
                    }
                },
                dom: 'rt<"bottom"lp><"clear">',
                columns: [
                    { data: 'id' },
                    { data: 'patient_name' },
                    { data: 'upload_timestamp', className: 'nowrap' },
                    { 
                        data: 'status',
                        orderable: false,
                        render: data => {
                            if (typeof data === 'string') {
                                return data.split('_')
                                           .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                                           .join(' ');
                            }
                            return data;
                        }
                    },
                    {
                        data: 'link',
                        orderable: false,
                        render: data => `<a href="${data}" target="_blank">View File</a>`
                    }
                ]
            });
    
            // Initialize DataTable for Completed Slides
            const completedTable = $('#completed-slides-table').DataTable({
                serverSide: true,
                order: [[2, "desc"]],
                ajax: {
                    url: '/data',
                    data: function (d) {
                        d.filterStatus = 'completed'; 
                    }
                },
                dom: 'rt<"bottom"lp><"clear">',
                columns: [
                    { data: 'id' },
                    { data: 'patient_name' },
                    { data: 'upload_timestamp', className: 'nowrap' },
                    { 
                        data: 'status',  // or 'classification' if that's the field name
                        render: data => {
                            if (typeof data === 'string') {
                                // Replace underscores with spaces and capitalize each word
                                return data.split('_')
                                           .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                                           .join(' ');
                            }
                            return data;
                        }
                    },
                    {
                        data: 'link',
                        orderable: false,
                        render: data => `<a href="${data}" target="_blank">View File</a>`
                    }
                ]
            });    
    
            $.fn.dataTable.ext.search.push((settings, data) => {
                const selectedDate = $('#timestamp-filter-active').data('selectedDate');
                if (!selectedDate) return true;
                const rowDate = data[2].split(' ')[0];
                return rowDate === selectedDate;
            });
    
            function setupTimestampSearchBar(table, headerCell, selectedDate) {
                const searchBarId = 'timestamp-search-bar-' + table.table().node().id;
                if ($('#' + searchBarId).length) return;
                $('<input>', {
                    type: 'text',
                    id: searchBarId,
                    placeholder: 'Filter by date',
                    val: selectedDate || '',
                    css: { display: 'block', width: '100%', marginTop: '5px' },
                    input: () => table.draw(),
                    focus: function () {
                        flatpickr('#' + searchBarId, {
                            defaultDate: $(this).val(),
                            onChange: selectedDates => {
                                if (selectedDates.length) {
                                    const newDate = selectedDates[0].toISOString().split('T')[0];
                                    $(this).val(newDate).trigger('input');
                                    table.column(2).search(newDate).draw();
                                }
                            }
                        }).open();
                    }
                }).appendTo(headerCell);
            }
    
            function setupPatientSearch(table, headerCell) {
                const button = $(headerCell).find('.patient-search-icon');
                button.on('click', function (e) {
                    e.stopPropagation();
                    const patientSearchBarClass = 'patient-search-bar-' + table.table().node().id;
                    const existingBar = $(headerCell).find('.' + patientSearchBarClass);
    
                    if (existingBar.length) {
                        if (existingBar.is(':visible')) {
                            existingBar.remove();
                            table.column(1).search('').draw();
                        } else {
                            existingBar.show();
                        }
                    } else {
                        const searchBar = $('<input>', {
                            type: 'text',
                            class: patientSearchBarClass,
                            placeholder: 'Search Patient Name',
                            css: { display: 'block', width: '100%', marginTop: '5px' }
                        }).appendTo(headerCell);
    
                        searchBar.on('input', function () {
                            table.column(1).search($(this).val()).draw();
                        }).on('click', function (e) {
                            e.stopPropagation();
                        });
                    }
                });
            }
    
            function setupTimestampFilter(table, headerCell) {
                $(headerCell).find('.timestamp-filter').on('click', function (e) {
                    e.stopPropagation();
                    const searchBarId = 'timestamp-search-bar-' + table.table().node().id;
                    const existingBar = $('#' + searchBarId);
    
                    if (existingBar.length) {
                        existingBar.remove();
                        table.column(2).search('').draw();
                    } else {
                        const tempInput = $('<input type="text" style="display:none;" />');
                        $('body').append(tempInput);
                        flatpickr(tempInput[0], {
                            positionElement: this,
                            onChange: selectedDates => {
                                if (selectedDates.length) {
                                    const selectedDate = selectedDates[0].toISOString().split('T')[0];
                                    $('#timestamp-filter-active').data('selectedDate', selectedDate);
                                    setupTimestampSearchBar(table, headerCell, selectedDate);
                                    table.column(2).search(selectedDate).draw();
                                }
                                tempInput.remove();
                            }
                        }).open();
                    }
                });
            }
    
            // Setup handlers for Queued Table
            const queuedHeaderCells = $('#slides-table thead th');
            setupPatientSearch(queuedTable, queuedHeaderCells.eq(1));
            setupTimestampFilter(queuedTable, queuedHeaderCells.eq(2));
    
            // Setup handlers for Completed Table
            const completedHeaderCells = $('#completed-slides-table thead th');
            setupPatientSearch(completedTable, completedHeaderCells.eq(1));
            setupTimestampFilter(completedTable, completedHeaderCells.eq(2));  
            

        // Screen Transition Handler for row clicks on Queued Table
        $('#slides-table tbody').on('click', 'tr', function () {
            const rowData = queuedTable.row(this).data();
            if (rowData) {
                // Update global selectedRowId when a row is clicked
                selectedRowId = rowData.id || "";
                
                $('#screen-1').hide();
                $('#screen-2').show();
                // If you display the selected row ID in screen-2, update the corresponding element
                $('#selected-row-id').text(selectedRowId);
                $('.back-link').hide();
                $('#new-back-button').show();
            }
        });

        $('#new-back-button').on('click', function (e) {
            e.preventDefault(); 
            $('#screen-2').hide();
            $('#screen-1').show();
            $(this).hide();
            $('.back-link').show();
        });
    });
}

    // Collapsible table functionality
    const collapsibleContainers = document.querySelectorAll(".collapsible-container");

    collapsibleContainers.forEach(container => {
        const collapseIcon = container.querySelector(".collapse-icon");
        const content = container.querySelector(".table-content");
        const icon = container.querySelector(".triangle");
    
        if (collapseIcon) {
            collapseIcon.addEventListener("click", () => {
                const isVisible = content.style.display !== "none";
                content.style.display = isVisible ? "none" : "block";
                icon.style.transform = isVisible ? "rotate(-90deg)" : "rotate(0)";
            });
        }
    });
});


