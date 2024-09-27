import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as iconv from 'iconv-lite';

@Injectable()
export class AxiosService {
  constructor(private readonly httpService: HttpService) {}

  /**
   * 获取ip地址
   * @returns {Promise<string>}
   */
  async getIpAddress(ip: string): Promise<string> {
    try {
      const IP_URL = 'https://whois.pconline.com.cn/ipJson.jsp';
      const response = await this.httpService.axiosRef(`${IP_URL}?ip=${ip}&json=true`, {
        responseType: 'arraybuffer',
        transformResponse: [
          function (data) {
            console.log(data);
            // 解决中文乱码问题
            const str = iconv.decode(data, 'gbk');
            return JSON.parse(str);
          },
        ],
      });
      return response.data.addr;
    } catch (error) {
      console.error(error);
      return '未知';
    }
  }
}
