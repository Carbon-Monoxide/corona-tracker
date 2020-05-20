class CovidChart {
  constructor(element) {
    this.element = element;
    this.deathStats = [];
    this.confirmedStats = [];
    this.recoveredStats = [];
    this.countries = [];

    this.updateDate;
    this.chartData;
  }

  show() {
    fetch("https://api.covid19api.com/summary")
      .then((response) => response.json())
      .then((data) => {
        try {
          data.Countries.splice(0, 1);

          this.chartData = data;
          this.prepareMapData();
        } catch (err) {
          window.location = '/500-error';
        }
      });
  }

  prepareMapData() {
    this.updateDate = this.chartData.Date.replace("Z", "").replace("T", " ");

    let data = this.chartData.Countries;
    let transformedData = [];

    for (let i = 0; i < data.length; i++) {
      let nextEntry = data[i];
      let newObject = {
        country: nextEntry.CountryCode,
        z: nextEntry.TotalDeaths,
      };

      transformedData.push(newObject);
    }
    this.chartData = transformedData;
    this.generate();
  }

  generate() {
    //generate chart
    Highcharts.mapChart(this.element, {
      chart: {
        borderWidth: 1,
        map: "custom/world",
      },

      title: {
        text: "Covid-19 Tracker",
      },

      subtitle: {
        text: `Updated ${this.updateDate}`,
      },

      legend: {
        enabled: false,
      },

      mapNavigation: {
        enabled: true,
        buttonOptions: {
          verticalAlign: "bottom",
        },
      },

      series: [
        {
          name: "Countries",
          color: "#E0E0E0",
          enableMouseTracking: false,
        },
        {
          type: "mapbubble",
          name: "Total Deaths",
          joinBy: ["iso-a2", "country"],
          data: this.chartData,
          minSize: 4,
          maxSize: "10%",
          tooltip: {
            pointFormat: "{point.properties.hc-a2}: {point.z}",
          },
        },
      ],
    });
  }
}
let chart = new CovidChart("container");
chart.show();
