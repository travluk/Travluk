import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import EditorJS, { OutputData, ToolSettings } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Table from '@editorjs/table';
import Image from '@editorjs/image';
import Embed from '@editorjs/embed';
import LinkTool from '@editorjs/link';
import { TestComponent } from '../test/test.component';
import Marker from '@editorjs/marker';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import Quote from '@editorjs/table';
import Checklist from '@editorjs/checklist';
import Delimiter from '@editorjs/delimiter';
import { CommonModule } from '@angular/common';
import EditorJsColumns from "@calumk/editorjs-columns";
import LinkAutocomplete from '@editorjs/link';
import ChangeCase from 'editorjs-change-case';
@Component({
  selector: 'app-editor-js',
  standalone: true,
  imports: [HttpClientModule, TestComponent, CommonModule],
  templateUrl: './editor-js.component.html',
  styleUrl: './editor-js.component.scss',
  providers: [],
})

export class EditorJsComponent implements AfterViewInit {
  
  @ViewChild('editor', { read: ElementRef, static: true })
  editorElement!: ElementRef;
  editor!: EditorJS;
  successMessage: any;
  errorMessage: any;
  ngAfterViewInit() {
    this.initializeEditor();
  }
  constructor(
    private viewContainerRef: ViewContainerRef,
    private httpClient: HttpClient
  ) {}
  saveContent() {
    this.editor.save().then((outputData: OutputData) => {
      console.log(outputData);
    });
  }
  // Add these functions to your EditorJsComponent class
  displaySuccessMessage(message: string) {
    // Assuming you have a property to store the success message
    this.successMessage = message;
  }

  displayErrorMessage(message: string) {
    // Assuming you have a property to store the error message
    this.errorMessage = message;
  }

  initializeEditor() {
    this.editor = new EditorJS({
      minHeight: 100,
      placeholder: 'Let`s write an awesome story!',
      autofocus: true,
      holder: this.editorElement.nativeElement,
      tools: {
    // columns: {
    //   class: EditorJsColumns,
    //   config: {
    //     tools: {
    //       header: Header,
    //       warning: Warning,
    //       delimiter: Delimiter,
    //       table: Table,
    //       paragraph: Paragraph,
    //       image: {
    //         class: Image
    //       }
    //     }
    //   }
    // }
    changeCase: {
      class: ChangeCase,
      config: {
        showLocaleOption: true, // enable locale case options
        locale: 'tr' // or ['tr', 'TR', 'tr-TR']
      }
    },
    link: {
      class: LinkAutocomplete,
      config: {
        endpoint: 'http://localhost:3000/',
        queryParam: 'search'
      }
    },
    Marker: {
      class: Marker,
      shortcut: 'CMD+SHIFT+M',
    },
        delimiter: Delimiter,
        
        embed: {
          class: Embed,
          config: {
            services: [
              'youtube',
              {
                codepen: {
                  regex:
                    /https?:\/\/codepen.io\/([^\/\?\&]*)\/pen\/([^\/\?\&]*)/,
                  embedUrl:
                    'https://codepen.io/<%= remote_id %>?height=300&theme-id=0&default-tab=css,result&embed-version=2',
                  html: "<iframe height='300' scrolling='no' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'></iframe>",
                  height: 300,
                  width: 600,
                  id: (groups: any) => groups.join('/embed/'),
                },
              },
            ],
          },
        },
        header: {
          class: Header,
          inlineToolbar: ['bold', 'italic', 'link', 'marker'],
        },
        image: {
          class: Image,
          config: {
            uploader: {
              uploadByFile: async (
                file: File
              ): Promise<{ success: number; file: { url: string } }> => {
                const formData = new FormData();
                formData.append('file', file);

                try {
                  const response = await this.httpClient
                    .post<{ data: string }>(
                      'http://travluk.in/api/files',
                      formData
                    )
                    .toPromise();

                  const successData = {
                    success: 1,
                    file: {
                      url: response?.data || '',
                    },
                  };

                  this.displaySuccessMessage('Image successfully uploaded!');

                  return successData;
                } catch (error) {
                  console.error('Image upload failed:', error);
                  const errorData = {
                    success: 0,
                    file: {
                      url: '',
                    },
                  };

                  // Display an error message on the screen
                  this.displayErrorMessage('Image upload failed!');

                  return errorData;
                }
              },
            },
          },
        },

        table: Table,
        quote: {
          class: Quote,
          inlineToolbar: true,
          shortcut: 'CMD+SHIFT+O',
          config: {
            quotePlaceholder: 'Enter a quote',
            captionPlaceholder: "Quote's author",
          },
        },
        checklist: {
          class: Checklist,
          inlineToolbar: true,
        },
      },
    });
  }
}
