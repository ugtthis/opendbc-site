export type SupportTypeContent = {
  paragraphs: string[]
  reference?: {
    text: string
    url: string
  }

  /**
 * Use when description exceeds 211 characters.
 * Prevents the description container from overflowing.
 */
  expandableContent?: {
    sections: {
      title: string
      paragraphs: string[]
      link?: {
        text: string
        url: string
      }
    }[]
  }
}

export const SUPPORT_TYPE_CONTENT: Record<string, SupportTypeContent> = {
  'Upstream': {
    paragraphs: [
      "A supported vehicle is one that just works when you install a " +
      "comma device. All supported cars provide a better experience than any stock system.",
      "Supported vehicles reference the US market unless otherwise specified."
    ]
  },
  'Under review': {
    paragraphs: [
      "A vehicle under review is one for which software support has been " +
      "merged into upstream openpilot, but hasn't yet been tested for " +
      "drive quality and conformance with comma safety guidelines(linked below)"
    ],
    expandableContent: {
      sections: [
        {
          title: "",
          paragraphs: [
            "This is a normal part of the development and quality assurance process." +
            "This vehicle will not work when upstream openpilot is installed, but " +
            "custom forks may allow their use."
          ]
        }
      ]
    },
    reference: {
      text: "comma Safety Guidelines",
      url: "https://github.com/commaai/openpilot/blob/master/docs/SAFETY.md"
    }
  },
  'Community': {
    paragraphs: [
      "Although they're not upstream, the community has openpilot running " +
      "on other makes and models. See the Community Supported Models section " +
      "of each make on our wiki (linked below)."
    ],
    reference: {
      text: "openpilot wiki",
      url: "https://github.com/commaai/openpilot/wiki"
    }
  },
  'Not compatible': {
    paragraphs: [
      "This vehicle is not compatible with openpilot.",
      "This may be due to incompatible safety systems, lack of CAN bus " +
      "access, or other technical limitations that prevent openpilot from " +
      "interfacing with the vehicle's controls."
    ],
    expandableContent: {
      sections: [
        {
          title: "CAN Bus Security",
          paragraphs: [
            "Vehicles with CAN security measures, such as AUTOSAR Secure " +
            "Onboard Communication (SecOC) are not usable with openpilot " +
            "unless the owner can recover the message signing key and " +
            "implement CAN message signing. Examples include certain newer " +
            "Toyota, and the GM Global B platform."
          ],
          link: {
            text: "CAN bus on Wikipedia",
            url: "https://en.wikipedia.org/wiki/CAN_bus"
          }
        },
        {
          title: "FlexRay",
          paragraphs: [
            "All the cars that openpilot supports use a CAN bus for " +
            "communication between all the car's computers, however a CAN " +
            "bus isn't the only way that the computers in your car can " +
            "communicate.",
            "Most, if not all, vehicles from the following " +
            "manufacturers use FlexRay instead of a CAN bus: BMW, Mercedes, " +
            "Audi, Land Rover, and some Volvo. These cars may one day be " +
            "supported, but we have no immediate plans to support FlexRay."
          ],
          link: {
            text: "FlexRay on Wikipedia",
            url: "https://en.wikipedia.org/wiki/FlexRay"
          }
        }
      ]
    }
  },
  'Dashcam mode': {
    paragraphs: [
      "Dashcam vehicles have software support in upstream openpilot, but " +
      "will go into \"dashcam mode\" at startup and will not engage.",
      "This may be due to known issues with driving safety or quality, or it " +
      "may be a work in progress that isn't yet ready for safety and " +
      "quality review."
    ]
  }
}

export const getSupportTypeOrder = (): string[] => [
  'Upstream',
  'Under review',
  'Community',
  'Dashcam mode',
  'Not compatible',
]
