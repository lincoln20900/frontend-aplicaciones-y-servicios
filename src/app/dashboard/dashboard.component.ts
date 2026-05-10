import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

const apiUrl = environment.apiUrl + '/servicios';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public lineBigDashboardChartType: string = 'line';
  public gradientStroke;
  public chartColor;
  public canvas: any;
  public ctx;
  public gradientFill;
  public lineBigDashboardChartOptions: any;
  public lineBigDashboardChartLabels: Array<any>;
  public lineBigDashboardChartColors: Array<any>
  public lineBigDashboardChartData: Array<any> = [{ data: [], label: '' }];
  
  public usuarioService: string;
  public gradientChartOptionsConfiguration: any;
  public gradientChartOptionsConfigurationWithNumbersAndGrid: any;
  
  public lineChartType;
  public lineChartData: Array<any>;
  public lineChartOptions: any;
  public lineChartLabels: Array<any>;
  public lineChartColors: Array<any>
  
  public totalMascotas: number = 0;
  public totalUsuario: number = 0;
  public popularRazas: Array<{ raza: string; cantidad: number }> = [];
  
  public lineChartWithNumbersAndGridType;
  public lineChartWithNumbersAndGridData: Array<any>;
  public lineChartWithNumbersAndGridOptions: any;
  public lineChartWithNumbersAndGridLabels: Array<any>;
  public lineChartWithNumbersAndGridColors: Array<any>
  
  public lineChartGradientsNumbersType;
  public lineChartGradientsNumbersData: Array<any>;
  public lineChartGradientsNumbersOptions: any;
  public lineChartGradientsNumbersLabels: Array<any>;
  public lineChartGradientsNumbersColors: Array<any>

  constructor(private http: HttpClient, private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.chartColor = "#FFFFFF";
    this.canvas = document.getElementById("bigDashboardChart");
    this.ctx = this.canvas.getContext("2d");
    
    this.gradientStroke = this.ctx.createLinearGradient(500, 0, 100, 0);
    this.gradientStroke.addColorStop(0, '#80b6f4');
    this.gradientStroke.addColorStop(1, this.chartColor);
    
    this.gradientFill = this.ctx.createLinearGradient(0, 200, 0, 50);
    this.gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
    this.gradientFill.addColorStop(1, "rgba(255, 255, 255, 0.24)");

    this.setDefaultRazasChart();
    this.cargarTotales();
    
    this.gradientStroke = this.ctx.createLinearGradient(500, 0, 100, 0);
    this.gradientStroke.addColorStop(0, '#80b6f4');
    this.gradientStroke.addColorStop(1, this.chartColor);
    
    this.gradientFill = this.ctx.createLinearGradient(0, 200, 0, 50);
    this.gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
    this.gradientFill.addColorStop(1, "rgba(255, 255, 255, 0.24)");

    // ✅ GRÁFICO GRANDE - Servicios por citas
    this.http.get<any[]>(`${environment.apiUrl}/servicios/estadisticas/uso`).subscribe({
      next: (data) => {
        console.log('✅ Datos recibidos de la API servicios:', data);

        if (data && data.length > 0) {
          this.lineBigDashboardChartLabels = data.map(s => s.nombre_servicio);
          this.lineBigDashboardChartData = [
            {
              label: 'Total de citas por servicio',
              data: data.map(s => s.total_citas),
              borderColor: '#36A2EB',
              backgroundColor: 'rgba(54,162,235,0.2)',
              fill: true,
              borderWidth: 2,
              pointBackgroundColor: '#fff'
            }
          ];

          this.lineBigDashboardChartColors = [
            {
              backgroundColor: 'rgba(54,162,235,0.2)',
              borderColor: '#36A2EB',
              pointBorderColor: '#36A2EB',
              pointBackgroundColor: '#fff'
            }
          ];
        } else {
          console.warn('⚠️ No se recibieron datos para el gráfico de servicios.');
        }
      },
      error: (err) => {
        console.error('❌ Error al obtener los datos de servicios:', err);
      }
    });

    this.lineBigDashboardChartOptions = {
      layout: {
        padding: {
          left: 20,
          right: 20,
          top: 0,
          bottom: 0
        }
      },
      maintainAspectRatio: false,
      tooltips: {
        backgroundColor: '#fff',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest"
      },
      legend: {
        position: "bottom",
        fillStyle: "#FFF",
        display: false
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: "rgba(255,255,255,0.4)",
            fontStyle: "bold",
            beginAtZero: true,
            maxTicksLimit: 5,
            padding: 10
          },
          gridLines: {
            drawTicks: true,
            drawBorder: false,
            display: true,
            color: "rgba(255,255,255,0.1)",
            zeroLineColor: "transparent"
          }
        }],
        xAxes: [{
          gridLines: {
            zeroLineColor: "transparent",
            display: false,
          },
          ticks: {
            padding: 10,
            fontColor: "rgba(255,255,255,0.4)",
            fontStyle: "bold"
          }
        }]
      }
    };

    this.lineBigDashboardChartType = 'line';

    this.gradientChartOptionsConfiguration = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      tooltips: {
        bodySpacing: 4,
        mode: "nearest",
        intersect: 0,
        position: "nearest",
        xPadding: 10,
        yPadding: 10,
        caretPadding: 10
      },
      responsive: 1,
      scales: {
        yAxes: [{
          display: 0,
          ticks: {
            display: false
          },
          gridLines: {
            zeroLineColor: "transparent",
            drawTicks: false,
            display: false,
            drawBorder: false
          }
        }],
        xAxes: [{
          display: 0,
          ticks: {
            display: false
          },
          gridLines: {
            zeroLineColor: "transparent",
            drawTicks: false,
            display: false,
            drawBorder: false
          }
        }]
      },
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 15,
          bottom: 15
        }
      }
    };

    this.gradientChartOptionsConfigurationWithNumbersAndGrid = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      tooltips: {
        bodySpacing: 4,
        mode: "nearest",
        intersect: 0,
        position: "nearest",
        xPadding: 10,
        yPadding: 10,
        caretPadding: 10
      },
      responsive: true,
      scales: {
        yAxes: [{
          gridLines: {
            zeroLineColor: "transparent",
            drawBorder: false
          },
          ticks: {
            stepSize: 500
          }
        }],
        xAxes: [{
          display: 0,
          ticks: {
            display: false
          },
          gridLines: {
            zeroLineColor: "transparent",
            drawTicks: false,
            display: false,
            drawBorder: false
          }
        }]
      },
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 15,
          bottom: 15
        }
      }
    };

    // ✅ GRÁFICO DE RAZAS - Razas más populares
    this.canvas = document.getElementById("lineChartExample");
    this.ctx = this.canvas.getContext("2d");

    this.gradientStroke = this.ctx.createLinearGradient(500, 0, 100, 0);
    this.gradientStroke.addColorStop(0, '#80b6f4');
    this.gradientStroke.addColorStop(1, this.chartColor);

    this.gradientFill = this.ctx.createLinearGradient(0, 170, 0, 50);
    this.gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
    this.gradientFill.addColorStop(1, "rgba(249, 99, 59, 0.40)");

    this.http.get<any[]>(`${environment.apiUrl}/razas-animal/estadisticas/uso`).subscribe({
      next: (data) => {
        console.log('✅ Datos recibidos de razas populares:', data);

        if (data && data.length > 0) {
          this.lineChartLabels = data.map(r => r.nombre_raza);
          
          this.lineChartData = [
            {
              label: "Total de animales por raza",
              pointBorderWidth: 2,
              pointHoverRadius: 4,
              pointHoverBorderWidth: 1,
              pointRadius: 4,
              fill: true,
              borderWidth: 2,
              data: data.map(r => r.total_animales)
            }
          ];

          this.lineChartColors = [
            {
              borderColor: "#f96332",
              pointBorderColor: "#FFF",
              pointBackgroundColor: "#f96332",
              backgroundColor: this.gradientFill
            }
          ];

          this.lineChartOptions = this.gradientChartOptionsConfiguration;
          this.lineChartType = 'line';

          console.log('📊 Gráfico de razas configurado con', data.length, 'razas');
        } else {
          console.warn('⚠️ No se recibieron datos de razas para el gráfico.');
          this.setDefaultRazasChart();
        }
      },
      error: (err) => {
        console.error('❌ Error al obtener estadísticas de razas:', err);
        this.setDefaultRazasChart();
      }
    });

    // ✅ GRÁFICO CON NÚMEROS Y GRID
    this.canvas = document.getElementById("lineChartExampleWithNumbersAndGrid");
    this.ctx = this.canvas.getContext("2d");

    this.gradientStroke = this.ctx.createLinearGradient(500, 0, 100, 0);
    this.gradientStroke.addColorStop(0, '#18ce0f');
    this.gradientStroke.addColorStop(1, this.chartColor);

    this.gradientFill = this.ctx.createLinearGradient(0, 170, 0, 50);
    this.gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
    this.gradientFill.addColorStop(1, this.hexToRGB('#18ce0f', 0.4));

    this.lineChartWithNumbersAndGridData = [
      {
        label: "Email Stats",
        pointBorderWidth: 2,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 1,
        pointRadius: 4,
        fill: true,
        borderWidth: 2,
        data: [40, 500, 650, 700, 1200, 1250, 1300, 1900]
      }
    ];

    this.lineChartWithNumbersAndGridColors = [
      {
        borderColor: "#18ce0f",
        pointBorderColor: "#FFF",
        pointBackgroundColor: "#18ce0f",
        backgroundColor: this.gradientFill
      }
    ];

    this.lineChartWithNumbersAndGridLabels = ["12pm,", "3pm", "6pm", "9pm", "12am", "3am", "6am", "9am"];
    this.lineChartWithNumbersAndGridOptions = this.gradientChartOptionsConfigurationWithNumbersAndGrid;
    this.lineChartWithNumbersAndGridType = 'line';


    // ✅ GRÁFICO DE BARRAS
    this.canvas = document.getElementById("barChartSimpleGradientsNumbers");
    this.ctx = this.canvas.getContext("2d");

    this.gradientFill = this.ctx.createLinearGradient(0, 170, 0, 50);
    this.gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
    this.gradientFill.addColorStop(1, this.hexToRGB('#2CA8FF', 0.6));

    this.lineChartGradientsNumbersData = [
      {
        label: "Active Countries",
        pointBorderWidth: 2,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 1,
        pointRadius: 4,
        fill: true,
        borderWidth: 1,
        data: [80, 99, 86, 96, 123, 85, 100, 75, 88, 90, 123, 155]
      }
    ];

    this.lineChartGradientsNumbersColors = [
      {
        backgroundColor: this.gradientFill,
        borderColor: "#2CA8FF",
        pointBorderColor: "#FFF",
        pointBackgroundColor: "#2CA8FF",
      }
    ];

    this.lineChartGradientsNumbersLabels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    this.lineChartGradientsNumbersOptions = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      tooltips: {
        bodySpacing: 4,
        mode: "nearest",
        intersect: 0,
        position: "nearest",
        xPadding: 10,
        yPadding: 10,
        caretPadding: 10
      },
      responsive: 1,
      scales: {
        yAxes: [{
          gridLines: {
            zeroLineColor: "transparent",
            drawBorder: false
          },
          ticks: {
            stepSize: 20
          }
        }],
        xAxes: [{
          display: 0,
          ticks: {
            display: false
          },
          gridLines: {
            zeroLineColor: "transparent",
            drawTicks: false,
            display: false,
            drawBorder: false
          }
        }]
      },
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 15,
          bottom: 15
        }
      }
    }

    this.lineChartGradientsNumbersType = 'bar';
  }

  // ✅ Método auxiliar para establecer valores por defecto del gráfico de razas
  private setDefaultRazasChart() {
    this.lineChartLabels = ["Sin datos"];
    this.lineChartData = [
      {
        label: "Total de animales por raza",
        pointBorderWidth: 2,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 1,
        pointRadius: 4,
        fill: true,
        borderWidth: 2,
        data: [0]
      }
    ];
    this.lineChartColors = [
      {
        borderColor: "#f96332",
        pointBorderColor: "#FFF",
        pointBackgroundColor: "#f96332",
        backgroundColor: this.gradientFill
      }
    ];
    this.lineChartOptions = this.gradientChartOptionsConfiguration;
    this.lineChartType = 'line';
  }

  // ✅ Eventos de los gráficos
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  public hexToRGB(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
      return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
      return "rgb(" + r + ", " + g + ", " + b + ")";
    }
  }
  cargarTotales() {
    // ✅ Obtener total de usuarios
    this.http.get<any>(`${environment.apiUrl}/usuarios`).subscribe({
      next: (data) => {
        const usuarios = Array.isArray(data) ? data : data?.usuarios ?? [];
        this.totalUsuario = usuarios.length;
        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error('❌ Error al obtener usuarios:', err);
      }
    });

    // ✅ Obtener total de mascotas y razas populares
    this.http.get<any>(`${environment.apiUrl}/mascotas`).subscribe({
      next: (data) => {
        const mascotas = Array.isArray(data) ? data : data?.mascotas ?? [];
        this.totalMascotas = mascotas.length;
        this.popularRazas = this.calcularRazasPopulares(mascotas);
        this.actualizarGraficoRazas(mascotas);
        console.log('✅ Total de mascotas:', this.totalMascotas, 'Razas populares:', this.popularRazas);
      },
      error: (err) => {
        console.error('❌ Error al obtener total de mascotas:', err);
      }
    });
  }

  private calcularRazasPopulares(mascotas: any[]): Array<{ raza: string; cantidad: number }> {
    if (!Array.isArray(mascotas) || mascotas.length === 0) {
      return [];
    }

    const conteoRazas: { [raza: string]: number } = {};
    mascotas.forEach((mascota) => {
      const raza = mascota.raza?.trim() || 'Desconocida';
      conteoRazas[raza] = (conteoRazas[raza] || 0) + 1;
    });

    return Object.keys(conteoRazas)
      .map((raza) => ({ raza, cantidad: conteoRazas[raza] }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5);
  }

  private actualizarGraficoRazas(mascotas: any[]) {
    if (!Array.isArray(mascotas) || mascotas.length === 0) {
      this.setDefaultRazasChart();
      return;
    }

    const ordenadas = this.calcularRazasPopulares(mascotas);
    if (ordenadas.length === 0) {
      this.setDefaultRazasChart();
      return;
    }

    this.lineChartLabels = ordenadas.map((item) => item.raza);
    this.lineChartData = [
      {
        label: 'Cantidad de mascotas por raza',
        pointBorderWidth: 2,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 1,
        pointRadius: 4,
        fill: true,
        borderWidth: 2,
        data: ordenadas.map((item) => item.cantidad)
      }
    ];
    this.lineChartColors = [
      {
        borderColor: '#f96332',
        pointBorderColor: '#FFF',
        pointBackgroundColor: '#f96332',
        backgroundColor: this.gradientFill || 'rgba(249,99,50,0.2)'
      }
    ];
    this.lineChartOptions = this.gradientChartOptionsConfiguration;
    this.lineChartType = 'line';
  }
}

